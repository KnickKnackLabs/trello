import { expect, test } from "bun:test";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { localPayloadFiles, payloadPath } from "../src/prepare-request.ts";

async function withCaller(run: (caller: string) => Promise<void>) {
  const root = await mkdtemp(join(tmpdir(), "trello caller "));
  const caller = join(root, "unrelated working directory");
  await mkdir(caller);
  const previous = process.env.TRELLO_CALLER_PWD;
  process.env.TRELLO_CALLER_PWD = caller;
  try {
    await run(caller);
  } finally {
    if (previous === undefined) delete process.env.TRELLO_CALLER_PWD;
    else process.env.TRELLO_CALLER_PWD = previous;
    await rm(root, { recursive: true, force: true });
  }
}

test("body files resolve relative to the caller, including spaces", async () => {
  await withCaller(async (caller) => {
    await writeFile(join(caller, "card body.json"), '{"idList":"fixture"}');
    expect(await localPayloadFiles.readText("card body.json")).toBe(
      '{"idList":"fixture"}',
    );
  });
});

test("uploads resolve relative to the caller and preserve filename and bytes", async () => {
  await withCaller(async (caller) => {
    await writeFile(
      join(caller, "fixture image.png"),
      new Uint8Array([0, 255, 7]),
    );
    const file = await localPayloadFiles.readUpload("fixture image.png");
    expect(file.name).toBe("fixture image.png");
    expect(new Uint8Array(await file.arrayBuffer())).toEqual(
      new Uint8Array([0, 255, 7]),
    );
  });
});

test("absolute payload paths are not rebased", async () => {
  await withCaller(async (caller) => {
    const path = join(caller, "absolute.json");
    await writeFile(path, "{}");
    expect(payloadPath(path)).toBe(path);
    expect(await localPayloadFiles.readText(path)).toBe("{}");
  });
});

test("without a caller environment, payload paths use cwd", () => {
  const previous = process.env.TRELLO_CALLER_PWD;
  delete process.env.TRELLO_CALLER_PWD;
  try {
    expect(payloadPath("body.json")).toBe(join(process.cwd(), "body.json"));
  } finally {
    if (previous !== undefined) process.env.TRELLO_CALLER_PWD = previous;
  }
});

test("a directory is not a body or upload file", async () => {
  await withCaller(async (caller) => {
    await expect(localPayloadFiles.readText(caller)).rejects.toThrow(
      "Cannot read JSON request body file",
    );
    await expect(localPayloadFiles.readUpload(caller)).rejects.toThrow(
      "Cannot read upload file",
    );
  });
});
