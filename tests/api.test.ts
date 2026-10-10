import { describe, expect, test } from "bun:test";
import { createReadClient, type Fetch } from "../src/api.ts";

const credentials = { key: "test-key", token: "test-token" };

describe("read-only HTTP client", () => {
  test("sends credentials only to the API, using GET and a timeout", async () => {
    const transport: Fetch = async (url, options) => {
      expect(url.origin).toBe("https://api.trello.com");
      expect(url.searchParams.get("key")).toBe(credentials.key);
      expect(url.searchParams.get("token")).toBe(credentials.token);
      expect(url.searchParams.get("fields")).toBe("name");
      expect(options.method).toBe("GET");
      expect(options.redirect).toBe("manual");
      expect(options.signal).toBeInstanceOf(AbortSignal);
      return Response.json([]);
    };
    await createReadClient(credentials, transport).get(
      "/1/members/me/boards?fields=name",
    );
  });

  test("rejects other origins, API versions, and embedded credentials before transport", async () => {
    const client = createReadClient(credentials, async () => {
      throw new Error("Transport should not run");
    });
    for (const path of [
      "https://example.com/1/cards",
      "//example.com/1/cards",
      "/2/cards",
      "https://user@api.trello.com/1/cards",
    ]) {
      await expect(client.get(path)).rejects.toThrow("Trello API /1/ origin");
    }
  });

  test("transport exceptions cannot expose credentials", async () => {
    const client = createReadClient(credentials, async (url) => {
      throw new Error(url.toString());
    });
    await expect(client.get("/1/cards/x")).rejects.toThrow(
      "network error or timeout",
    );
  });

  for (const status of [401, 403, 404, 429, 500]) {
    test(`reports HTTP ${status} without dumping the response body`, async () => {
      const client = createReadClient(
        credentials,
        async () => new Response("test-token", { status }),
      );
      await expect(client.get("/1/cards/x")).rejects.toThrow(
        `Trello API returned HTTP ${status}`,
      );
    });
  }

  test("does not follow ordinary endpoint redirects", async () => {
    const client = createReadClient(
      credentials,
      async () =>
        new Response(null, {
          status: 302,
          headers: { location: "https://example.com" },
        }),
    );
    await expect(client.get("/1/cards/x")).rejects.toThrow(
      "only supported for downloads",
    );
  });

  test("downloads follow HTTPS redirects without forwarding API credentials", async () => {
    const urls: URL[] = [];
    const client = createReadClient(credentials, async (url) => {
      urls.push(new URL(url));
      if (urls.length === 1)
        return new Response(null, {
          status: 302,
          headers: {
            location:
              "https://storage.example/export?signature=signed&key=test-key&token=test-token",
          },
        });
      return new Response(new Uint8Array([0, 1, 255]));
    });
    const response = await client.get("/1/boards/x/exports/y/download", {
      download: true,
    });
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(
      new Uint8Array([0, 1, 255]),
    );
    expect(urls[1]!.searchParams.has("key")).toBe(false);
    expect(urls[1]!.searchParams.has("token")).toBe(false);
    expect(urls[1]!.searchParams.get("signature")).toBe("signed");
  });

  test("rejects insecure download redirects", async () => {
    const client = createReadClient(
      credentials,
      async () =>
        new Response(null, {
          status: 302,
          headers: { location: "http://storage.example/export" },
        }),
    );
    await expect(
      client.get("/1/boards/x/exports/y/download", { download: true }),
    ).rejects.toThrow("HTTPS");
  });

  test("bounds redirect loops", async () => {
    const client = createReadClient(
      credentials,
      async () =>
        new Response(null, {
          status: 302,
          headers: { location: "https://storage.example/loop" },
        }),
    );
    await expect(
      client.get("/1/boards/x/exports/y/download", { download: true }),
    ).rejects.toThrow("redirect limit");
  });
});
