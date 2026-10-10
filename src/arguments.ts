import type { Endpoint, Parameter } from "./endpoint.ts";

export type ParsedArguments = {
  path: string;
  uploads: { name: string; file: string }[];
  json?: { kind: "inline" | "file"; value: string };
};

export function endpointHelp(endpoint: Endpoint): string {
  const lines = [
    endpoint.summary,
    `${endpoint.method} ${endpoint.path}`,
    "",
    `Usage: mise run ${endpoint.task} -- [options]`,
    "",
  ];
  if (endpoint.method !== "GET") {
    lines.push(
      "WARNING: This command changes Trello data immediately. No confirmation or retries.",
      "",
    );
  }
  for (const parameter of endpoint.parameters) {
    const requirement = parameter.required ? "required" : "optional";
    lines.push(
      `  --${parameter.name} ${parameter.location === "file" ? "FILE" : "VALUE"} (${parameter.location}, ${requirement}${parameter.type ? `, ${parameter.type}` : ""})`,
    );
    if (parameter.description) lines.push(`    ${parameter.description}`);
  }
  if (endpoint.method !== "GET") {
    lines.push(
      "  --body-json JSON (JSON object request body)",
      "  --body-file FILE (read a JSON object request body from a file)",
    );
    if (endpoint.jsonBody) {
      lines.push(
        `    Documented JSON fields: ${endpoint.jsonBody.fields.join(", ") || "nested/alternative schema; see API reference"}`,
      );
      if (endpoint.jsonBody.required)
        lines.push("    This endpoint requires a JSON body.");
      if (endpoint.jsonBody.requiredFields.length) {
        lines.push(
          `    Required body fields: ${endpoint.jsonBody.requiredFields.join(", ")}`,
        );
      }
    }
  }
  lines.push(
    "  --param NAME=VALUE (extra query parameter; repeatable)",
    "  --help (show this help without credentials or network access)",
    "",
    "Booleans require explicit true/false. Arrays use comma-separated values.",
    "GET commands return one API page; use API parameters to paginate.",
  );
  return lines.join("\n") + "\n";
}

export function validateValue(parameter: Parameter, value: string) {
  if (parameter.required && !value)
    throw new Error(`--${parameter.name} cannot be empty`);
  if (parameter.type === "boolean" && !["true", "false"].includes(value)) {
    throw new Error(`--${parameter.name} must be true or false`);
  }
  if (["integer", "number"].includes(parameter.type ?? "")) {
    const number = Number(value);
    const validDecimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(
      value,
    );
    const validInteger =
      parameter.type !== "integer" || /^[+-]?\d+$/.test(value);
    if (!validDecimal || !validInteger || !Number.isFinite(number)) {
      throw new Error(`--${parameter.name} must be a valid ${parameter.type}`);
    }
  }
}

/** Parse without filesystem or network access; payload loading is a separate step. */
export function parseArguments(
  endpoint: Endpoint,
  args: string[],
): ParsedArguments {
  const values = new Map<string, string>();
  const query = new URLSearchParams();
  const uploads: ParsedArguments["uploads"] = [];
  let json: ParsedArguments["json"];
  const parameters = new Map(
    endpoint.parameters.map((parameter) => [parameter.name, parameter]),
  );

  for (let index = 0; index < args.length; index++) {
    const argument = args[index]!;
    if (!argument.startsWith("--"))
      throw new Error("Expected a named --option");
    const equals = argument.indexOf("=");
    const name = argument.slice(2, equals < 0 ? undefined : equals);
    const value = equals < 0 ? args[++index] : argument.slice(equals + 1);
    if (value === undefined || (equals < 0 && value.startsWith("--"))) {
      throw new Error(`--${name} requires a value`);
    }

    if (["body-json", "body-file"].includes(name)) {
      if (endpoint.method === "GET")
        throw new Error("GET commands do not accept request bodies");
      if (json)
        throw new Error("Use exactly one of --body-json or --body-file");
      if (!value) throw new Error(`--${name} cannot be empty`);
      json = { kind: name === "body-json" ? "inline" : "file", value };
      continue;
    }

    if (name === "param") {
      const separator = value.indexOf("=");
      if (separator < 1) throw new Error("--param requires NAME=VALUE");
      const queryName = value.slice(0, separator);
      if (["key", "token"].includes(queryName)) {
        throw new Error(
          "Credentials must come from the environment, not --param",
        );
      }
      const declared = parameters.get(queryName);
      if (declared && declared.location !== "query") {
        throw new Error(
          `Use --${queryName} for the ${declared.location} parameter`,
        );
      }
      if (query.has(queryName))
        throw new Error(`Duplicate query parameter: ${queryName}`);
      const queryValue = value.slice(separator + 1);
      if (declared) validateValue(declared, queryValue);
      query.set(queryName, queryValue);
      continue;
    }

    const parameter = parameters.get(name);
    if (!parameter) throw new Error(`Unknown option: --${name}. See --help`);
    if (
      values.has(name) ||
      (parameter.location === "query" && query.has(name))
    ) {
      throw new Error(`Duplicate option: --${name}`);
    }
    validateValue(parameter, value);
    if (parameter.location === "path" && [".", ".."].includes(value)) {
      throw new Error(`--${name} cannot be a dot segment`);
    }
    values.set(name, value);
    if (parameter.location === "query") query.set(name, value);
    if (parameter.location === "file") {
      if (!value) throw new Error(`--${name} cannot be empty`);
      uploads.push({ name, file: value });
    }
  }

  if (json && uploads.length)
    throw new Error("JSON bodies and multipart uploads cannot be combined");
  if (endpoint.jsonBody?.required && !json)
    throw new Error("This endpoint requires --body-json or --body-file");
  for (const parameter of endpoint.parameters) {
    const provided =
      parameter.location === "query"
        ? query.has(parameter.name)
        : values.has(parameter.name);
    // A JSON payload can supply query-style write fields. Check those after loading it.
    const deferredToBody = parameter.location === "query" && json;
    if (parameter.required && !provided && !deferredToBody) {
      throw new Error(`Missing required --${parameter.name}`);
    }
  }

  const path = endpoint.path.replace(/\{([^}]+)\}/g, (_, name: string) => {
    const value = values.get(name);
    if (value === undefined) throw new Error(`Missing required --${name}`);
    return encodeURIComponent(value);
  });
  const suffix = query.toString();
  return {
    path: suffix ? `${path}?${suffix}` : path,
    uploads,
    ...(json ? { json } : {}),
  };
}

/** Convenient URL-only interface for read commands and argument tests. */
export function endpointPath(endpoint: Endpoint, args: string[]): string {
  return parseArguments(endpoint, args).path;
}
