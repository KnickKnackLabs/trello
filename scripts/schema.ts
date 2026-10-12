import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

export const schemaUrl =
  "https://dac-static.atlassian.com/cloud/trello/swagger.v3.json?_v=1.1274.0";
export const schemaSha256 =
  "b07c97d06e93f7caff661a307e86f2b58c1f97591614ac8179f8e31bda27334b";
export const schemaPath = resolve(
  import.meta.dir,
  "../spec/trello.openapi.json",
);

export function verifySchema(bytes: Uint8Array): void {
  if (createHash("sha256").update(bytes).digest("hex") !== schemaSha256) {
    throw new Error(
      "Schema checksum mismatch; review upstream changes before updating the pin",
    );
  }
}

export async function readSchema() {
  const bytes = await readFile(schemaPath);
  verifySchema(bytes);
  return JSON.parse(bytes.toString());
}

/** Explicit development fetch; consumers run the checked-in generated tasks. */
export async function fetchSchema(): Promise<void> {
  try {
    await readSchema();
    console.log("Pinned schema already cached and verified");
    return;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const response = await fetch(schemaUrl, {
    redirect: "error",
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok)
    throw new Error(`Schema fetch failed: HTTP ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  verifySchema(bytes);
  JSON.parse(new TextDecoder().decode(bytes));
  await mkdir(dirname(schemaPath), { recursive: true });
  const temporary = `${schemaPath}.${process.pid}.tmp`;
  try {
    await writeFile(temporary, bytes, { flag: "wx", mode: 0o600 });
    await rename(temporary, schemaPath);
  } finally {
    await rm(temporary, { force: true });
  }
  console.log("Fetched and verified pinned Trello schema");
}
