import { describe, expect, test } from "bun:test";
import { access, constants } from "node:fs/promises";
import { resolve } from "node:path";
import spec from "../spec/trello.openapi.json";
import catalog from "../spec/endpoints.json";
import { endpointPath } from "../src/arguments.ts";
import type { Endpoint } from "../src/endpoint.ts";
import { executeEndpoint } from "../src/run-endpoint.ts";

const endpoints = catalog as Endpoint[];
const root = resolve(import.meta.dir, "..");
const actionEndpoint = endpoints.find(
  (endpoint) =>
    endpoint.method === "GET" && endpoint.path === "/1/actions/{id}",
)!;
const noFiles = {
  readText: async () => {
    throw new Error("No body file expected");
  },
  readUpload: async () => new File(["test bytes"], "fixture.txt"),
};

function requiredArgs(endpoint: Endpoint): string[] {
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
  if (endpoint.jsonBody?.required || endpoint.jsonBody?.requiredFields.length) {
    const body = Object.fromEntries(
      endpoint.jsonBody.requiredFields.map((name) => [name, `value-${name}`]),
    );
    args.push("--body-json", JSON.stringify(body));
  }
  return args;
}

test("catalog includes exactly every HTTP operation in the pinned reference", () => {
  const operations = Object.entries(spec.paths)
    .flatMap(([path, item]) =>
      ["get", "post", "put", "delete", "patch"]
        .filter((method) => method in item)
        .map((method) => `${method.toUpperCase()} /1${path}`),
    )
    .sort();
  expect(
    endpoints.map((endpoint) => `${endpoint.method} ${endpoint.path}`).sort(),
  ).toEqual(operations);
  expect(new Set(endpoints.map((endpoint) => endpoint.task)).size).toBe(
    endpoints.length,
  );
  expect(
    endpoints.filter((endpoint) => endpoint.method === "GET"),
  ).toHaveLength(128);
  expect(endpoints).toHaveLength(261);
});

describe("every documented endpoint", () => {
  for (const endpoint of endpoints) {
    test(`${endpoint.task}: real entry point and one correctly prepared operation`, async () => {
      const taskPath = `${root}/mise-tasks/${endpoint.task.replaceAll(":", "/")}`;
      await access(taskPath, constants.X_OK);
      expect(await Bun.file(taskPath).text()).toContain(
        JSON.stringify(endpoint, null, 2),
      );
      // TypeScript ignores extensionless files, so run every task through Bun too.
      const helpProcess = Bun.spawn(["bun", taskPath, "--help"], {
        cwd: root,
        env: { ...process.env, TRELLO_API_KEY: "", TRELLO_TOKEN: "" },
        stdout: "pipe",
        stderr: "pipe",
      });
      const help = await new Response(helpProcess.stdout).text();
      expect(await helpProcess.exited).toBe(0);
      expect(help).toContain(`${endpoint.method} ${endpoint.path}`);
      if (endpoint.method !== "GET") expect(help).toContain("WARNING");

      const args = requiredArgs(endpoint);
      const expectedPath = endpointPath(endpoint, args);
      expect(expectedPath).not.toMatch(/[{}]/);
      let requests = 0;
      let printed = "";
      await executeEndpoint(
        endpoint,
        args,
        {
          request: async (request) => {
            requests++;
            expect(request.path).toBe(expectedPath);
            expect(request.method).toBe(endpoint.method);
            if (
              endpoint.parameters.some(
                (parameter) =>
                  parameter.location === "file" && parameter.required,
              )
            ) {
              expect(request.body).toBeInstanceOf(FormData);
            }
            if (endpoint.jsonBody?.required) expect(request.body).toBeString();
            return Response.json({ ok: true });
          },
        },
        {
          write: async (data) => {
            printed +=
              typeof data === "string" ? data : new TextDecoder().decode(data);
          },
        },
        noFiles,
      );
      expect(requests).toBe(1);
      expect(JSON.parse(printed)).toEqual({ ok: true });
    });
  }
});

test("invalid write arguments fail without credentials or network access", async () => {
  const child = Bun.spawn(["bun", "mise-tasks/api/cards/post"], {
    cwd: root,
    env: { ...process.env, TRELLO_API_KEY: "", TRELLO_TOKEN: "" },
    stdout: "pipe",
    stderr: "pipe",
  });
  const error = await new Response(child.stderr).text();
  expect(await child.exited).toBe(1);
  expect(error).toContain("Missing required --idList");
});

test("boards:list alias keeps read behavior and member-board query options", async () => {
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
      request: async () => new Response(null, { status: 204 }),
    },
    {
      write: async () => {
        throw new Error("Should not print an empty response");
      },
    },
  );
});

test("empty JSON response after a write emits no output", async () => {
  const endpoint = endpoints.find(
    (item) => item.task === "api:cards:by-id:delete",
  )!;
  await executeEndpoint(
    endpoint,
    ["--id", "x"],
    {
      request: async () =>
        new Response("", { headers: { "content-type": "application/json" } }),
    },
    {
      write: async () => {
        throw new Error("Should not print empty JSON");
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
        request: async () => new Response(body),
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
      request: async () => new Response("a field value"),
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
        request: async () =>
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
      request: async () => new Response(new Uint8Array([0, 255, 10, 128])),
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
