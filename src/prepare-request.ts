import { stat } from "node:fs/promises";
import { basename } from "node:path";
import type { ApiRequest } from "./api.ts";
import type { Endpoint } from "./endpoint.ts";
import { parseArguments, validateValue } from "./arguments.ts";

export type PayloadFiles = {
  readText: (path: string) => Promise<string>;
  readUpload: (path: string) => Promise<File>;
};

async function requireRegularFile(path: string) {
  if (!(await stat(path)).isFile()) throw new Error("Expected a regular file");
}

export const localPayloadFiles: PayloadFiles = {
  readText: async (path) => {
    try {
      await requireRegularFile(path);
      return await Bun.file(path).text();
    } catch {
      throw new Error("Cannot read JSON request body file");
    }
  },
  readUpload: async (path) => {
    try {
      await requireRegularFile(path);
      const file = Bun.file(path);
      return new File([await file.arrayBuffer()], basename(path), {
        type: file.type,
      });
    } catch {
      throw new Error("Cannot read upload file");
    }
  },
};

/** Build and validate a payload before credentials or HTTP are involved. */
export async function prepareRequest(
  endpoint: Endpoint,
  args: string[],
  files: PayloadFiles = localPayloadFiles,
): Promise<ApiRequest> {
  const parsed = parseArguments(endpoint, args);
  const request: ApiRequest = {
    method: endpoint.method,
    path: parsed.path,
    download: endpoint.download,
  };

  if (parsed.json) {
    const text =
      parsed.json.kind === "file"
        ? await files.readText(parsed.json.value)
        : parsed.json.value;
    let body: Record<string, unknown>;
    try {
      const value: unknown = JSON.parse(text);
      if (!value || typeof value !== "object" || Array.isArray(value))
        throw new Error();
      body = value as Record<string, unknown>;
    } catch {
      throw new Error("Request body must be a valid JSON object");
    }
    if (Object.hasOwn(body, "key") || Object.hasOwn(body, "token")) {
      throw new Error(
        "Credentials must come from the environment, not the JSON body",
      );
    }
    const query = new URL(parsed.path, "https://api.trello.com").searchParams;
    for (const name of query.keys()) {
      if (Object.hasOwn(body, name))
        throw new Error(`Field supplied in both query and JSON body: ${name}`);
    }
    for (const parameter of endpoint.parameters) {
      if (parameter.location !== "query" || query.has(parameter.name)) continue;
      const present = Object.hasOwn(body, parameter.name);
      if (parameter.required && !present)
        throw new Error(
          `Missing required --${parameter.name} or JSON body field`,
        );
      if (present && body[parameter.name] !== null) {
        validateValue(parameter, String(body[parameter.name]));
      }
    }
    for (const name of endpoint.jsonBody?.requiredFields ?? []) {
      if (!Object.hasOwn(body, name))
        throw new Error(`Missing required JSON body field: ${name}`);
    }
    request.body = JSON.stringify(body);
    request.headers = { "content-type": "application/json" };
  }

  if (parsed.uploads.length) {
    const form = new FormData();
    for (const upload of parsed.uploads) {
      form.set(upload.name, await files.readUpload(upload.file));
    }
    request.body = form;
    // Fetch must set the multipart boundary; do not set Content-Type ourselves.
  }
  return request;
}
