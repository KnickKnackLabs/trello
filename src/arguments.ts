import type { Endpoint, Parameter } from "./endpoint.ts";

export function endpointHelp(endpoint: Endpoint): string {
  const lines = [
    endpoint.summary,
    `GET ${endpoint.path}`,
    "",
    `Usage: mise run ${endpoint.task} -- [options]`,
    "",
  ];
  for (const parameter of endpoint.parameters) {
    const requirement = parameter.required ? "required" : "optional";
    lines.push(
      `  --${parameter.name} VALUE (${parameter.location}, ${requirement}${parameter.type ? `, ${parameter.type}` : ""})`,
    );
    if (parameter.description) lines.push(`    ${parameter.description}`);
  }
  lines.push(
    "  --param NAME=VALUE (extra query parameter; repeatable)",
    "  --help (show this help without credentials or network access)",
    "",
    "Booleans require explicit true/false. Arrays use comma-separated values.",
    "One API page is returned; pagination is controlled by API parameters.",
  );
  return lines.join("\n") + "\n";
}

function validateValue(parameter: Parameter, value: string) {
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

/** Parse only declared flags; --param is the explicit schema-gap escape hatch. */
export function endpointPath(endpoint: Endpoint, args: string[]): string {
  const values = new Map<string, string>();
  const query = new URLSearchParams();
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

    if (name === "param") {
      const separator = value.indexOf("=");
      if (separator < 1) throw new Error("--param requires NAME=VALUE");
      const queryName = value.slice(0, separator);
      if (["key", "token"].includes(queryName)) {
        throw new Error(
          "Credentials must come from the environment, not --param",
        );
      }
      if (parameters.get(queryName)?.location === "path") {
        throw new Error(`Use --${queryName} for the path parameter`);
      }
      if (query.has(queryName))
        throw new Error(`Duplicate query parameter: ${queryName}`);
      const queryValue = value.slice(separator + 1);
      const declared = parameters.get(queryName);
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
    // Dot segments are normalized by URL, even when percent-encoded.
    if (parameter.location === "path" && [".", ".."].includes(value)) {
      throw new Error(`--${name} cannot be a dot segment`);
    }
    values.set(name, value);
    if (parameter.location === "query") query.set(name, value);
  }

  for (const parameter of endpoint.parameters) {
    const provided =
      parameter.location === "path"
        ? values.has(parameter.name)
        : query.has(parameter.name);
    if (parameter.required && !provided)
      throw new Error(`Missing required --${parameter.name}`);
  }

  const path = endpoint.path.replace(/\{([^}]+)\}/g, (_, name: string) => {
    const value = values.get(name);
    if (value === undefined) throw new Error(`Missing required --${name}`);
    return encodeURIComponent(value);
  });
  const suffix = query.toString();
  return suffix ? `${path}?${suffix}` : path;
}
