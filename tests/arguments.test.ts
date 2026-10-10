import { describe, expect, test } from "bun:test";
import { endpointHelp, endpointPath } from "../src/arguments.ts";
import type { Endpoint } from "../src/endpoint.ts";

const endpoint: Endpoint = {
  task: "cards:by-id:get",
  path: "/1/cards/{id}",
  summary: "Get a card",
  parameters: [
    { name: "id", location: "path", required: true },
    { name: "members", location: "query", required: false, type: "boolean" },
    { name: "limit", location: "query", required: false, type: "integer" },
    { name: "fields", location: "query", required: false, type: "string" },
  ],
};

describe("endpoint arguments", () => {
  test("encodes path and query values without changing their meaning", () => {
    const path = endpointPath(endpoint, [
      "--id",
      "a/b?c#d",
      "--fields=name,url",
      "--members",
      "false",
    ]);
    const url = new URL(path, "https://api.trello.com");
    expect(url.pathname).toBe("/1/cards/a%2Fb%3Fc%23d");
    expect(url.searchParams.get("fields")).toBe("name,url");
    expect(url.searchParams.get("members")).toBe("false");
  });

  test("explicit extra parameters cover omissions in the schema", () => {
    const path = endpointPath(endpoint, [
      "--id",
      "abc",
      "--param",
      "before=2026-01-01",
      "--param",
      "limit=3",
    ]);
    expect(
      new URL(path, "https://api.trello.com").searchParams.get("before"),
    ).toBe("2026-01-01");
  });

  const invalidCases = [
    { name: "missing path", args: [], message: "Missing required --id" },
    { name: "unknown flag", args: ["--typo", "x"], message: "Unknown option" },
    { name: "missing value", args: ["--id"], message: "requires a value" },
    {
      name: "next flag is not a value",
      args: ["--id", "--fields", "name"],
      message: "requires a value",
    },
    {
      name: "boolean",
      args: ["--id", "x", "--members", "yes"],
      message: "true or false",
    },
    {
      name: "integer",
      args: ["--id", "x", "--limit", "1.5"],
      message: "valid integer",
    },
    {
      name: "empty number",
      args: ["--id", "x", "--limit="],
      message: "valid integer",
    },
    {
      name: "duplicate flag",
      args: ["--id", "x", "--id", "y"],
      message: "Duplicate option",
    },
    {
      name: "duplicate escape hatch",
      args: ["--id", "x", "--param", "fields=a", "--fields=b"],
      message: "Duplicate option",
    },
    {
      name: "escape hatch path",
      args: ["--param", "id=x"],
      message: "path parameter",
    },
    {
      name: "escape hatch credentials",
      args: ["--id", "x", "--param", "token=secret"],
      message: "environment",
    },
    { name: "dot segment", args: ["--id", ".."], message: "dot segment" },
    { name: "empty path", args: ["--id="], message: "cannot be empty" },
  ];
  for (const scenario of invalidCases) {
    test(`rejects ${scenario.name}`, () => {
      expect(() => endpointPath(endpoint, scenario.args)).toThrow(
        scenario.message,
      );
    });
  }

  test("required query parameters can use either spelling", () => {
    const search: Endpoint = {
      task: "search:get",
      path: "/1/search",
      summary: "Search",
      parameters: [{ name: "query", location: "query", required: true }],
    };
    expect(() => endpointPath(search, [])).toThrow("Missing required --query");
    expect(endpointPath(search, ["--param", "query=hello world"])).toBe(
      "/1/search?query=hello+world",
    );
  });

  test("help explains required parameters and pagination", () => {
    const help = endpointHelp(endpoint);
    expect(help).toContain("--id VALUE (path, required)");
    expect(help).toContain("One API page");
  });
});
