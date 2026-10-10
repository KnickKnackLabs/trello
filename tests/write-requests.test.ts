import { describe, expect, test } from "bun:test";
import { createApiClient, createReadClient } from "../src/api.ts";
import { prepareRequest, type PayloadFiles } from "../src/prepare-request.ts";
import { parseArguments } from "../src/arguments.ts";
import catalog from "../spec/endpoints.json";
import type { Endpoint, HttpMethod } from "../src/endpoint.ts";

const endpoints = catalog as Endpoint[];
const credentials = { key: "test-key", token: "test-token" };
function endpoint(task: string): Endpoint {
  const found = endpoints.find((item) => item.task === task);
  if (!found) throw new Error(`Missing test endpoint ${task}`);
  return found;
}
const createCard = endpoint("api:cards:post");
const updateCard = endpoint("api:cards:by-id:put");
const fakeFiles: PayloadFiles = {
  readText: async () => JSON.stringify({ idList: "list", name: "Candidate" }),
  readUpload: async () =>
    new File([new Uint8Array([0, 255, 7])], "photo.png", { type: "image/png" }),
};

describe("write payload preparation", () => {
  test("create/comment/move flags use the documented query parameters", async () => {
    const card = await prepareRequest(createCard, [
      "--idList",
      "list",
      "--name",
      "New place",
      "--desc",
      "Line one\nLine two",
    ]);
    const url = new URL(card.path, "https://api.trello.com");
    expect(card.method).toBe("POST");
    expect(url.searchParams.get("desc")).toBe("Line one\nLine two");
    expect(card.body).toBeUndefined();
    const comment = await prepareRequest(
      endpoint("api:cards:by-id:actions:comments:post"),
      ["--id", "card", "--text", "Hello & goodbye"],
    );
    expect(
      new URL(comment.path, "https://api.trello.com").searchParams.get("text"),
    ).toBe("Hello & goodbye");
    const move = await prepareRequest(updateCard, [
      "--id",
      "card",
      "--idList",
      "next-list",
    ]);
    expect(move.method).toBe("PUT");
    expect(move.path).toBe("/1/cards/card?idList=next-list");
  });

  test("inline JSON supplies required card fields without duplicating them in the query", async () => {
    const request = await prepareRequest(createCard, [
      "--body-json",
      '{"idList":"list","name":"Candidate"}',
    ]);
    expect(request.path).toBe("/1/cards");
    expect(request.headers).toEqual({ "content-type": "application/json" });
    expect(JSON.parse(request.body as string)).toEqual({
      idList: "list",
      name: "Candidate",
    });
  });

  test("JSON files use the same validation and encoding", async () => {
    const request = await prepareRequest(
      createCard,
      ["--body-file", "card.json"],
      fakeFiles,
    );
    expect(JSON.parse(request.body as string).name).toBe("Candidate");
  });

  test("nested custom-field values retain their JSON structure", async () => {
    const item = endpoint(
      "api:cards:by-idCard:customField:by-idCustomField:item:put",
    );
    const request = await prepareRequest(item, [
      "--idCard",
      "card",
      "--idCustomField",
      "field",
      "--body-json",
      '{"value":{"text":"Cat allowed"}}',
    ]);
    expect(JSON.parse(request.body as string)).toEqual({
      value: { text: "Cat allowed" },
    });
  });

  test("documented required JSON fields are checked", async () => {
    const settings = endpoint(
      "api:members:by-id:notificationChannelSettings:put",
    );
    expect(() => parseArguments(settings, ["--id", "me"])).toThrow(
      "requires --body-json",
    );
    await expect(
      prepareRequest(settings, ["--id", "me", "--body-json", "{}"]),
    ).rejects.toThrow("Missing required JSON body field: channel");
  });

  const invalidBodies = ["{broken", "null", "[]", '"text"', "123"];
  for (const body of invalidBodies) {
    test(`rejects non-object/invalid JSON (${body}) without printing its contents`, async () => {
      await expect(
        prepareRequest(createCard, ["--body-json", body]),
      ).rejects.toThrow("valid JSON object");
    });
  }
  test("body cannot bypass required query fields", async () => {
    await expect(
      prepareRequest(createCard, ["--body-json", "{}"]),
    ).rejects.toThrow("Missing required --idList");
  });
  test("ambiguous query/body duplicates and embedded credentials are rejected", async () => {
    await expect(
      prepareRequest(createCard, [
        "--idList",
        "a",
        "--body-json",
        '{"idList":"b"}',
      ]),
    ).rejects.toThrow("both query and JSON body");
    await expect(
      prepareRequest(createCard, [
        "--body-json",
        '{"idList":"a","token":"secret"}',
      ]),
    ).rejects.toThrow("Credentials must come from the environment");
  });
  test("body sources are mutually exclusive and GET bodies are rejected", () => {
    expect(() =>
      parseArguments(createCard, ["--body-file", "a", "--body-json", "{}"]),
    ).toThrow("exactly one");
    expect(() =>
      parseArguments(endpoint("api:cards:by-id:get"), [
        "--id",
        "x",
        "--body-json",
        "{}",
      ]),
    ).toThrow("GET commands do not accept");
  });

  for (const uploadEndpoint of endpoints.filter((item) =>
    item.parameters.some((parameter) => parameter.location === "file"),
  )) {
    test(`${uploadEndpoint.task}: file flags become multipart bytes, never query paths`, async () => {
      const args = uploadEndpoint.parameters
        .filter(
          (parameter) => parameter.required || parameter.location === "file",
        )
        .flatMap((parameter) => [
          `--${parameter.name}`,
          parameter.location === "file" ? "image.png" : "fixture",
        ]);
      const request = await prepareRequest(uploadEndpoint, args, fakeFiles);
      expect(request.body).toBeInstanceOf(FormData);
      expect(request.headers).toBeUndefined();
      for (const parameter of uploadEndpoint.parameters.filter(
        (item) => item.location === "file",
      )) {
        expect(
          new URL(request.path, "https://api.trello.com").searchParams.has(
            parameter.name,
          ),
        ).toBe(false);
        const file = (request.body as FormData).get(parameter.name) as File;
        expect(file.name).toBe("photo.png");
        expect(new Uint8Array(await file.arrayBuffer())).toEqual(
          new Uint8Array([0, 255, 7]),
        );
      }
    });
  }
  test("uploads cannot be mixed with JSON bodies or sent via --param", () => {
    const upload = endpoint("api:cards:by-id:attachments:post");
    expect(() =>
      parseArguments(upload, [
        "--id",
        "x",
        "--file",
        "image.png",
        "--body-json",
        "{}",
      ]),
    ).toThrow("cannot be combined");
    expect(() =>
      parseArguments(upload, ["--id", "x", "--param", "file=image.png"]),
    ).toThrow("file parameter");
  });
  test("missing local files give safe errors before any HTTP request", async () => {
    await expect(
      prepareRequest(createCard, [
        "--body-file",
        "/nonexistent/trello-body.json",
      ]),
    ).rejects.toThrow("Cannot read JSON request body file");
    await expect(
      prepareRequest(endpoint("api:members:by-id:avatar:post"), [
        "--id",
        "me",
        "--file",
        "/nonexistent/avatar.png",
      ]),
    ).rejects.toThrow("Cannot read upload file");
  });
});

describe("mutation transport", () => {
  for (const method of ["POST", "PUT", "DELETE", "PATCH"] as HttpMethod[]) {
    test(`${method} is transmitted exactly once, with the chosen body`, async () => {
      let calls = 0;
      const client = createApiClient(credentials, async (url, options) => {
        calls++;
        expect(options.method).toBe(method);
        expect(options.body).toBe('{"name":"Candidate"}');
        expect(options.headers).toEqual({ "content-type": "application/json" });
        expect(url.searchParams.get("token")).toBe("test-token");
        return new Response(null, { status: 204 });
      });
      await client.request({
        method,
        path: "/1/cards/x",
        body: '{"name":"Candidate"}',
        headers: { "content-type": "application/json" },
      });
      expect(calls).toBe(1);
    });
  }
  test("failed or redirected mutations are never retried/replayed", async () => {
    for (const status of [302, 429, 500]) {
      let calls = 0;
      const client = createApiClient(credentials, async () => {
        calls++;
        return new Response("test-token", {
          status,
          headers: { location: "https://example.com" },
        });
      });
      await expect(
        client.request({ method: "POST", path: "/1/cards" }),
      ).rejects.toThrow(`HTTP ${status}`);
      expect(calls).toBe(1);
    }
  });
  test("network failures report uncertain write outcomes without leaking the request", async () => {
    let calls = 0;
    const client = createApiClient(credentials, async (url) => {
      calls++;
      throw new Error(url.toString());
    });
    await expect(
      client.request({ method: "POST", path: "/1/cards" }),
    ).rejects.toThrow("write outcome unknown");
    expect(calls).toBe(1);
  });

  test("narrow read client cannot be tricked into sending a write method", async () => {
    const client = createReadClient(credentials, async (_, options) => {
      expect(options.method).toBe("GET");
      return Response.json({});
    });
    await client.get("/1/cards/x", { method: "DELETE" } as {
      download?: boolean;
    });
  });
  test("rejects GET bodies and mutation download redirects before transport", async () => {
    const client = createApiClient(credentials, async () => {
      throw new Error("Should not reach transport");
    });
    await expect(
      client.request({ method: "GET", path: "/1/cards/x", body: "oops" }),
    ).rejects.toThrow("cannot have a body");
    await expect(
      client.request({ method: "POST", path: "/1/cards", download: true }),
    ).rejects.toThrow("Only GET");
  });
});

test("real fetch serializes multipart uploads with an automatic boundary (local server only)", async () => {
  let receivedMethod = "";
  let receivedFile: File | undefined;
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch: async (request) => {
      receivedMethod = request.method;
      expect(request.headers.get("content-type")).toContain(
        "multipart/form-data; boundary=",
      );
      receivedFile = (await request.formData()).get("file") as File;
      return Response.json({ ok: true });
    },
  });
  try {
    const client = createApiClient(credentials, (url, options) => {
      const localUrl = new URL(url.pathname + url.search, server.url);
      return fetch(localUrl, options);
    });
    const request = await prepareRequest(
      endpoint("api:cards:by-id:attachments:post"),
      ["--id", "card", "--file", "photo.png"],
      fakeFiles,
    );
    const response = await client.request(request);
    expect(await response.json()).toEqual({ ok: true });
    expect(receivedMethod).toBe("POST");
    expect(receivedFile!.name).toBe("photo.png");
    expect(new Uint8Array(await receivedFile!.arrayBuffer())).toEqual(
      new Uint8Array([0, 255, 7]),
    );
  } finally {
    await server.stop(true);
  }
});
