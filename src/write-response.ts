import type { Endpoint } from "./endpoint.ts";

export type Output = { write: (text: string | Uint8Array) => Promise<void> };

export async function writeResponse(
  endpoint: Endpoint,
  response: Response,
  output: Output,
): Promise<void> {
  if (response.status === 204) return;
  if (endpoint.download) {
    if (!response.body) return;
    try {
      for await (const chunk of response.body) await output.write(chunk);
    } catch {
      throw new Error("Download stream failed; output may be incomplete");
    }
    return;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("json")) {
    let data: unknown;
    try {
      const text = await response.text();
      // Some successful writes have an empty body even without HTTP 204.
      if (!text.trim()) return;
      data = JSON.parse(text);
    } catch {
      throw new Error("Trello API returned invalid JSON");
    }
    await output.write(JSON.stringify(data, null, 2) + "\n");
  } else {
    let text: string;
    try {
      text = await response.text();
    } catch {
      throw new Error("Trello response stream failed");
    }
    await output.write(text);
  }
}
