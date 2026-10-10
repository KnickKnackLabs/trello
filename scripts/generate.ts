import { mkdir, writeFile, chmod, readFile, stat } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import type { Endpoint, Parameter, HttpMethod } from "../src/endpoint.ts";

const root = resolve(import.meta.dir, "..");
type Schema = {
  $ref?: string;
  type?: string;
  format?: string;
  properties?: Record<string, Schema>;
  required?: string[];
};
type ApiParameter = {
  $ref?: string;
  name: string;
  in: "path" | "query";
  required?: boolean;
  description?: string;
  schema?: Schema;
};
type Operation = {
  summary?: string;
  parameters?: ApiParameter[];
  requestBody?: {
    required?: boolean;
    content?: Record<string, { schema?: Schema }>;
  };
};
type PathItem = Partial<Record<Lowercase<HttpMethod>, Operation>> & {
  parameters?: ApiParameter[];
};
type OpenApi = { paths: Record<string, PathItem> };

const spec: OpenApi = await Bun.file(`${root}/spec/trello.openapi.json`).json();
const check = process.argv.includes("--check");
const endpoints: Endpoint[] = [];

function dereference<T extends { $ref?: string }>(value: T): T {
  if (!value?.$ref) return value;
  if (!value.$ref.startsWith("#/"))
    throw new Error("External schema refs are unsupported");
  let resolved: unknown = spec;
  for (const key of value.$ref.slice(2).split("/")) {
    resolved = (resolved as Record<string, unknown>)[key];
    if (resolved === undefined)
      throw new Error(`Unresolved schema reference: ${value.$ref}`);
  }
  return dereference(resolved as T);
}

for (const [path, item] of Object.entries(spec.paths)) {
  for (const method of ["get", "post", "put", "delete", "patch"] as const) {
    const operation = item[method];
    if (!operation) continue;

    // Keeping placeholders in the command tree avoids collisions between e.g.
    // /cards/{id}/attachments and /cards/{id}/attachments/{idAttachment}.
    const segments = path
      .split("/")
      .filter(Boolean)
      .map((segment) => {
        const placeholder = segment.match(/^\{(.+)\}$/);
        return placeholder ? `by-${placeholder[1]}` : segment;
      });
    const task = ["api", ...segments, method].join(":");
    const parameters = new Map<string, Parameter>();

    for (const raw of [
      ...(item.parameters ?? []),
      ...(operation.parameters ?? []),
    ]) {
      const parameter = dereference(raw);
      if (!["path", "query"].includes(parameter.in)) {
        throw new Error(`Unsupported parameter location in ${path}`);
      }
      const schema = dereference(parameter.schema ?? {});
      parameters.set(`${parameter.in}:${parameter.name}`, {
        name: parameter.name,
        location: schema.format === "binary" ? "file" : parameter.in,
        required: parameter.in === "path" || parameter.required === true,
        type: schema.type,
        description: parameter.description,
      });
    }

    // A few documented paths omit their path parameters from the schema.
    for (const match of path.matchAll(/\{([^}]+)\}/g)) {
      const name = match[1]!;
      if (!parameters.has(`path:${name}`)) {
        parameters.set(`path:${name}`, {
          name,
          location: "path",
          required: true,
        });
      }
    }

    const bodyContent = operation.requestBody?.content;
    if (
      bodyContent &&
      Object.keys(bodyContent).some((type) => type !== "application/json")
    ) {
      throw new Error(
        `Unsupported request body content type in ${method} ${path}`,
      );
    }
    const bodySchema = dereference(
      bodyContent?.["application/json"]?.schema ?? {},
    );
    endpoints.push({
      task,
      method: method.toUpperCase() as HttpMethod,
      path: `/1${path}`,
      summary: operation.summary ?? `${method.toUpperCase()} ${path}`,
      parameters: [...parameters.values()],
      ...(bodyContent
        ? {
            jsonBody: {
              required: operation.requestBody?.required === true,
              requiredFields: bodySchema.required ?? [],
              fields: Object.keys(bodySchema.properties ?? {}),
            },
          }
        : {}),
      ...(method === "get" && path.endsWith("/download")
        ? { download: true }
        : {}),
    });
  }
}

endpoints.sort((a, b) => (a.task < b.task ? -1 : a.task > b.task ? 1 : 0));
if (
  new Set(endpoints.map((endpoint) => endpoint.task)).size !== endpoints.length
) {
  throw new Error("Generated task names collide");
}

async function emit(path: string, content: string, executable = false) {
  if (check) {
    const existing = await readFile(path, "utf8");
    if (existing !== content)
      throw new Error(`Generated file is stale: ${relative(root, path)}`);
    if (executable && !((await stat(path)).mode & 0o111)) {
      throw new Error(`Task is not executable: ${path}`);
    }
    return;
  }
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
  if (executable) await chmod(path, 0o755);
}

const expectedTasks = new Set(
  endpoints.map((endpoint) => endpoint.task.replaceAll(":", "/")),
);
for await (const file of new Bun.Glob("**/*").scan(`${root}/mise-tasks`)) {
  if (expectedTasks.has(file)) continue;
  const content = await Bun.file(`${root}/mise-tasks/${file}`).text();
  if (content.includes("// Generated by scripts/generate.ts;")) {
    throw new Error(
      `Obsolete generated task: ${file}. Review and remove it before regenerating.`,
    );
  }
}

for (const endpoint of endpoints) {
  const taskPath = `${root}/mise-tasks/${endpoint.task.replaceAll(":", "/")}`;
  const runner = relative(dirname(taskPath), `${root}/src/run-endpoint.ts`);
  const content = [
    "#!/usr/bin/env bun",
    `//MISE description=${JSON.stringify(endpoint.summary)}`,
    "// Generated by scripts/generate.ts; edit the generator, not this file.",
    "",
    `import { runEndpoint } from ${JSON.stringify(runner)};`,
    "",
    `await runEndpoint(${JSON.stringify(endpoint, null, 2)});`,
    "",
  ].join("\n");
  await emit(taskPath, content, true);
}

await emit(
  `${root}/spec/endpoints.json`,
  JSON.stringify(endpoints, null, 2) + "\n",
);
const inventory = [
  "# API endpoint inventory",
  "",
  "Generated from `spec/trello.openapi.json`. All documented HTTP operations are included.",
  "Path placeholders become `by-NAME` directories; pass their values as `--NAME VALUE`.",
  "",
  "| Mise task | Method | API path | Description |",
  "| --- | --- | --- | --- |",
  ...endpoints.map(
    (endpoint) =>
      `| \`${endpoint.task}\` | ${endpoint.method} | \`${endpoint.path}\` | ${endpoint.summary.replaceAll("|", "\\|")} |`,
  ),
  "",
];
await emit(`${root}/docs/endpoints.md`, inventory.join("\n"));
console.log(
  `${check ? "Checked" : "Generated"} ${endpoints.length} API endpoint tasks`,
);
