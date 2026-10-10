import { describe, expect, test } from "bun:test";
import { access, constants } from "node:fs/promises";
import { resolve } from "node:path";
import spec from "../spec/trello.openapi.json";
import catalog from "../spec/read-endpoints.json";
import { endpointPath } from "../src/arguments.ts";
import type { Endpoint } from "../src/endpoint.ts";
import { executeEndpoint } from "../src/run-endpoint.ts";

const endpoints = catalog as Endpoint[];
const root = resolve(import.meta.dir, "..");
const actionEndpoint = endpoints.find(
  (endpoint) => endpoint.path === "/1/actions/{id}",
)!;

test("catalog includes exactly every GET path in the pinned API reference", () => {
  const getPaths = Object.entries(spec.paths)
    .filter(([, item]) => "get" in item)
    .map(([path]) => `/1${path}`)
    .sort();
  expect(endpoints.map((endpoint) => endpoint.path).sort()).toEqual(getPaths);
  expect(new Set(endpoints.map((endpoint) => endpoint.task)).size).toBe(
    endpoints.length,
  );
});

describe("every documented GET endpoint", () => {
  for (const endpoint of endpoints) {
    test(`${endpoint.task}: executable task and one correctly substituted request`, async () => {
      const taskPath = `${root}/mise-tasks/${endpoint.task.replaceAll(":", "/")}`;
      await access(taskPath, constants.X_OK);
      const source = await Bun.file(taskPath).text();
      expect(source).toContain(JSON.stringify(endpoint, null, 2));
      // Extensionless mise task files are not included by TypeScript's compiler.
      // Exercise each real entry point through Bun as well as its metadata.
      const helpProcess = Bun.spawn(["bun", taskPath, "--help"], {
        cwd: root,
        env: { ...process.env, TRELLO_API_KEY: "", TRELLO_TOKEN: "" },
        stdout: "pipe",
        stderr: "pipe",
      });
      const help = await new Response(helpProcess.stdout).text();
      expect(await helpProcess.exited).toBe(0);
      expect(help).toContain(`GET ${endpoint.path}`);

      const args = endpoint.parameters
        .filter((parameter) => parameter.required)
        .flatMap((parameter) => {
          const value =
            parameter.type === "boolean"
              ? "true"
              : ["number", "integer"].includes(parameter.type ?? "")
                ? "1"
                : `value-${parameter.name}`;
          return [`--${parameter.name}`, value];
        });
      const expectedPath = endpointPath(endpoint, args);
      expect(expectedPath).not.toMatch(/[{}]/);
      let requests = 0;
      let printed = "";
      await executeEndpoint(
        endpoint,
        args,
        {
          get: async (path) => {
            requests++;
            expect(path).toBe(expectedPath);
            return Response.json({ ok: true });
          },
        },
        {
          write: async (data) => {
            printed +=
              typeof data === "string" ? data : new TextDecoder().decode(data);
          },
        },
      );
      expect(requests).toBe(1);
      expect(JSON.parse(printed)).toEqual({ ok: true });
    });
  }
});

test("help runs as a real executable task without credentials", async () => {
  const child = Bun.spawn(
    ["bun", "mise-tasks/api/actions/by-id/get", "--help"],
    {
      cwd: root,
      env: { ...process.env, TRELLO_API_KEY: "", TRELLO_TOKEN: "" },
      stdout: "pipe",
      stderr: "pipe",
    },
  );
  const text = await new Response(child.stdout).text();
  expect(await child.exited).toBe(0);
  expect(text).toContain("GET /1/actions/{id}");
  expect(text).toContain("--id VALUE");
});

test("missing arguments fail before credentials are required", async () => {
  const child = Bun.spawn(["bun", "mise-tasks/api/actions/by-id/get"], {
    cwd: root,
    env: { ...process.env, TRELLO_API_KEY: "", TRELLO_TOKEN: "" },
    stdout: "pipe",
    stderr: "pipe",
  });
  const error = await new Response(child.stderr).text();
  expect(await child.exited).toBe(1);
  expect(error).toContain("Missing required --id");
});

test("boards:list alias exposes member-board query options without credentials", async () => {
  const child = Bun.spawn(["bun", "mise-tasks/boards/list", "--help"], {
    cwd: root,
    env: { ...process.env, TRELLO_API_KEY: "", TRELLO_TOKEN: "" },
    stdout: "pipe",
    stderr: "pipe",
  });
  const text = await new Response(child.stdout).text();
  expect(await child.exited).toBe(0);
  expect(text).toContain("GET /1/members/me/boards");
  expect(text).toContain("--fields VALUE");
  expect(text).not.toContain("--id VALUE");
});

test("no-content response emits no output", async () => {
  await executeEndpoint(
    actionEndpoint,
    ["--id", "x"],
    {
      get: async () => new Response(null, { status: 204 }),
    },
    {
      write: async () => {
        throw new Error("Should not print an empty response");
      },
    },
  );
});

test("failed download streams cannot leak transport errors", async () => {
  const endpoint = endpoints.find((item) => item.download)!;
  const body = new ReadableStream({
    start(controller) {
      controller.error(new Error("secret-token"));
    },
  });
  await expect(
    executeEndpoint(
      endpoint,
      ["--id", "x", "--idExport", "y"],
      {
        get: async () => new Response(body),
      },
      { write: async () => {} },
    ),
  ).rejects.toThrow("Download stream failed; output may be incomplete");
});

test("plain text field output is preserved", async () => {
  let output = "";
  await executeEndpoint(
    actionEndpoint,
    ["--id", "x"],
    {
      get: async () => new Response("a field value"),
    },
    {
      write: async (data) => {
        output += data;
      },
    },
  );
  expect(output).toBe("a field value");
});

test("invalid JSON gives a safe diagnostic", async () => {
  await expect(
    executeEndpoint(
      actionEndpoint,
      ["--id", "x"],
      {
        get: async () =>
          new Response("not JSON", {
            headers: { "content-type": "application/json" },
          }),
      },
      { write: async () => {} },
    ),
  ).rejects.toThrow("invalid JSON");
});

test("download output preserves binary bytes", async () => {
  const endpoint = endpoints.find((item) => item.download)!;
  const chunks: Uint8Array[] = [];
  await executeEndpoint(
    endpoint,
    ["--id", "board", "--idExport", "export"],
    {
      get: async () => new Response(new Uint8Array([0, 255, 10, 128])),
    },
    {
      write: async (data) => {
        expect(data).toBeInstanceOf(Uint8Array);
        chunks.push(data as Uint8Array);
      },
    },
  );
  expect(Buffer.concat(chunks)).toEqual(Buffer.from([0, 255, 10, 128]));
});
