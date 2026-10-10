import {
  createApiClient,
  environmentCredentials,
  type ApiClient,
} from "./api.ts";
import { endpointHelp } from "./arguments.ts";
import type { Endpoint } from "./endpoint.ts";
import {
  prepareRequest,
  localPayloadFiles,
  type PayloadFiles,
} from "./prepare-request.ts";
import { writeResponse, type Output } from "./write-response.ts";

/** Exactly one operation: no implicit traversal, retries, or follow-up writes. */
export async function executeEndpoint(
  endpoint: Endpoint,
  args: string[],
  client: ApiClient,
  output: Output,
  files: PayloadFiles = localPayloadFiles,
): Promise<void> {
  const request = await prepareRequest(endpoint, args, files);
  const response = await client.request(request);
  await writeResponse(endpoint, response, output);
}

export async function runEndpoint(endpoint: Endpoint): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 1 && ["--help", "-h"].includes(args[0]!)) {
    console.log(endpointHelp(endpoint));
    return;
  }
  try {
    // Load and validate inputs before credentials or network access.
    const request = await prepareRequest(endpoint, args);
    const client = createApiClient(environmentCredentials());
    const response = await client.request(request);
    await writeResponse(endpoint, response, {
      write: async (data) => {
        await Bun.write(Bun.stdout, data);
      },
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Request failed");
    process.exitCode = 1;
  }
}
