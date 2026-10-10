import {
  createReadClient,
  environmentCredentials,
  type ReadClient,
} from "./api.ts";
import { endpointHelp, endpointPath } from "./arguments.ts";
import type { Endpoint } from "./endpoint.ts";

export type Output = {
  write: (text: string | Uint8Array) => Promise<void>;
};

/** One request, one page, explicit output: no implicit traversal of the account. */
export async function executeEndpoint(
  endpoint: Endpoint,
  args: string[],
  client: ReadClient,
  output: Output,
): Promise<void> {
  const path = endpointPath(endpoint, args);
  const response = await client.get(path, { download: endpoint.download });
  if (response.status === 204) return;

  if (endpoint.download) {
    // Preserve export bytes rather than attempting to parse them as JSON.
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
      data = await response.json();
    } catch {
      throw new Error("Trello API returned invalid JSON");
    }
    await output.write(JSON.stringify(data, null, 2) + "\n");
  } else {
    // Field endpoints may return plain text; do not coerce valid text into JSON.
    let text: string;
    try {
      text = await response.text();
    } catch {
      throw new Error("Trello response stream failed");
    }
    await output.write(text);
  }
}

export async function runEndpoint(endpoint: Endpoint): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 1 && ["--help", "-h"].includes(args[0]!)) {
    console.log(endpointHelp(endpoint));
    return;
  }

  try {
    // Validate arguments before asking for credentials or making a request.
    endpointPath(endpoint, args);
    const client = createReadClient(environmentCredentials());
    await executeEndpoint(endpoint, args, client, {
      write: async (data) => {
        await Bun.write(Bun.stdout, data);
      },
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Request failed");
    process.exitCode = 1;
  }
}
