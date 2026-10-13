import { expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
// Set this to a real Shiv-generated shim to exercise the installed boundary.
const shim = process.env.TRELLO_TEST_SHIM;
async function fixture() {
  const base = await mkdtemp(join(tmpdir(), "trello-boundary-"));
  const dir = join(base, "caller with spaces");
  await mkdir(dir);
  const capture = join(dir, "request.json");
  const preload = join(base, "mock.ts");
  await writeFile(
    preload,
    `
import { writeFileSync } from "node:fs";
// Fail closed if preload is not honored: the caller starts without credentials.
if(!process.env.MOCK_NO_AUTH) {
 process.env.TRELLO_API_KEY = "fixture-key";
 process.env.TRELLO_TOKEN = "fixture-token";
}
globalThis.fetch = async (input, init) => {
 const url = new URL(String(input));
 if(url.origin !== "https://api.trello.com") throw new Error("Unexpected network origin");
 let body = init?.body;
 if(body instanceof FormData) {
  const parts = {};
  for(const [name, value] of body.entries()) {
   parts[name] = typeof value === "string" ? value : {name:value.name, bytes:await value.text()};
  }
  body = parts;
 } else if(typeof body === "string") body = JSON.parse(body);
 writeFileSync(process.env.MOCK_CAPTURE, JSON.stringify({method:init?.method,path:url.pathname,body}));
 return new Response(JSON.stringify({ok:true}), {status:Number(process.env.MOCK_STATUS || 200),headers:{"content-type":"application/json"}});
};
`,
  );
  return {
    base,
    dir,
    capture,
    env: {
      ...process.env,
      TRELLO_API_KEY: "",
      TRELLO_TOKEN: "",
      TRELLO_CALLER_PWD: dir,
      MOCK_CAPTURE: capture,
      BUN_OPTIONS: `--preload ${preload}`,
    },
  };
}
async function run(
  f: Awaited<ReturnType<typeof fixture>>,
  task: string,
  args: string[],
  env = {},
) {
  // Exercise the preferred installed syntax, not just mise's colon task names.
  // --help is special: mise consumes it unless explicitly passed through.
  const command = shim
    ? [
        shim,
        ...task.split(":"),
        ...(args.includes("--help") ? ["--"] : []),
        ...args,
      ]
    : ["mise", "-C", root, "run", task, "--", ...args];
  const p = Bun.spawn(command, {
    cwd: f.dir,
    env: { ...f.env, ...env },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(p.stdout).text(),
    new Response(p.stderr).text(),
    p.exited,
  ]);
  return { stdout, stderr, code };
}

test("public command accepts caller-relative JSON with spaces and keeps JSON stdout clean", async () => {
  const f = await fixture();
  try {
    const body = { idList: "fixture-list", name: "A fixture" };
    await writeFile(join(f.dir, "card body.json"), JSON.stringify(body));
    const r = await run(f, "api:cards:post", ["--body-file", "card body.json"]);
    expect(r.code).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual({ ok: true });
    expect(JSON.parse(await readFile(f.capture, "utf8"))).toEqual({
      method: "POST",
      path: "/1/cards",
      body,
    });
    expect(r.stderr).not.toContain("fixture-token");
  } finally {
    await rm(f.base, { recursive: true, force: true });
  }
}, 30000);

test("public command uploads a caller-relative file as multipart", async () => {
  const f = await fixture();
  try {
    await writeFile(join(f.dir, "attachment data.txt"), "fixture upload bytes");
    const r = await run(f, "api:cards:by-id:attachments:post", [
      "--id",
      "fixture-card",
      "--file",
      "attachment data.txt",
    ]);
    expect(r.code).toBe(0);
    const request = JSON.parse(await readFile(f.capture, "utf8"));
    expect(request.body.file).toEqual({
      name: "attachment data.txt",
      bytes: "fixture upload bytes",
    });
    expect(request.path).toBe("/1/cards/fixture-card/attachments");
    expect(JSON.parse(r.stdout)).toEqual({ ok: true });
  } finally {
    await rm(f.base, { recursive: true, force: true });
  }
}, 30000);

test("public command propagates a failing request without leaking credentials", async () => {
  const f = await fixture();
  try {
    const r = await run(f, "api:boards:by-id:get", ["--id", "fixture-board"], {
      MOCK_STATUS: "403",
    });
    expect(r.code).toBe(1);
    expect(r.stdout).toBe("");
    expect(r.stderr).toContain("403");
    expect(r.stderr).not.toContain("fixture-token");
    expect(r.stderr).not.toContain("fixture-key");
  } finally {
    await rm(f.base, { recursive: true, force: true });
  }
}, 30000);

test("public command help needs no credentials or request", async () => {
  const f = await fixture();
  try {
    const r = await run(f, "api:cards:post", ["--help"], {
      TRELLO_API_KEY: "",
      TRELLO_TOKEN: "",
      MOCK_NO_AUTH: "1",
    });
    expect(r.code).toBe(0);
    expect(r.stdout).toContain("--body-file");
    expect(r.stdout).toContain("POST");
    expect(await Bun.file(f.capture).exists()).toBe(false);
  } finally {
    await rm(f.base, { recursive: true, force: true });
  }
}, 30000);
