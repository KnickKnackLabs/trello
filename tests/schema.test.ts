import { expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { readSchema, schemaPath, verifySchema } from "../scripts/schema.ts";

test("cached development schema matches the immutable checksum pin", async () => {
  expect(() => verifySchema(new Uint8Array())).toThrow("checksum mismatch");
  const bytes = await readFile(schemaPath);
  expect(() => verifySchema(bytes)).not.toThrow();
  const changed = new Uint8Array(bytes);
  changed[0] = changed[0]! ^ 1;
  expect(() => verifySchema(changed)).toThrow("checksum mismatch");
  expect((await readSchema()).paths).toBeDefined();
});
