export type Credentials = { key: string; token: string };
export type Fetch = (url: URL, options: RequestInit) => Promise<Response>;
export type ReadClient = {
  get: (path: string, options?: { download?: boolean }) => Promise<Response>;
};

export function environmentCredentials(): Credentials {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  if (!key || !token) {
    throw new Error(
      "Set TRELLO_API_KEY and TRELLO_TOKEN before making requests",
    );
  }
  return { key, token };
}

/** The injected transport and GET-only interface keep endpoint tasks read-only. */
export function createReadClient(
  credentials: Credentials,
  fetchFn: Fetch = fetch,
): ReadClient {
  async function send(url: URL): Promise<Response> {
    try {
      return await fetchFn(url, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(30_000),
      });
    } catch {
      // Transport exceptions may include the authenticated URL.
      throw new Error("Trello request failed: network error or timeout");
    }
  }

  async function get(
    path: string,
    options: { download?: boolean } = {},
  ): Promise<Response> {
    let url: URL;
    try {
      url = new URL(path, "https://api.trello.com");
    } catch {
      throw new Error("Invalid Trello API URL");
    }
    if (
      url.origin !== "https://api.trello.com" ||
      !url.pathname.startsWith("/1/") ||
      url.username ||
      url.password
    ) {
      throw new Error("Requests must use the Trello API /1/ origin");
    }
    url.searchParams.set("key", credentials.key);
    url.searchParams.set("token", credentials.token);

    let response = await send(url);
    let previousUrl = url;
    let redirects = 0;
    while ([301, 302, 303, 307, 308].includes(response.status)) {
      if (!options.download) {
        throw new Error(
          `Trello API returned HTTP ${response.status}; redirects are only supported for downloads`,
        );
      }
      if (redirects++ >= 5) throw new Error("Download exceeded redirect limit");
      const location = response.headers.get("location");
      if (!location)
        throw new Error("Download redirect is missing its location");

      let target: URL;
      try {
        target = new URL(location, previousUrl);
      } catch {
        throw new Error("Download redirect has an invalid location");
      }
      if (target.protocol !== "https:" || target.username || target.password) {
        throw new Error(
          "Download redirects must use HTTPS without embedded credentials",
        );
      }
      // Never carry the API key/token into storage requests, including relative redirects.
      target.searchParams.delete("key");
      target.searchParams.delete("token");
      try {
        await response.body?.cancel();
      } catch {
        throw new Error("Download redirect response stream failed");
      }
      response = await send(target);
      previousUrl = target;
    }

    if (!response.ok) {
      throw new Error(`Trello API returned HTTP ${response.status}`);
    }
    return response;
  }

  return { get };
}

/** Compatibility helper for small hand-written JSON tasks. No runtime schema validation. */
export async function request<T>(path: string): Promise<T> {
  const client = createReadClient(environmentCredentials());
  const response = await client.get(path);
  if (response.status === 204) return undefined as T;
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("Trello API returned invalid JSON");
  }
}
