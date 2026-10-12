import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const gate = join(import.meta.dir, "../.mise/tasks/validate");
async function fixture() {
  const dir = await mkdtemp(join(tmpdir(), "trello-gate-test-"));
  const executable = `#!/usr/bin/env bash
set -euo pipefail
name="$(basename "$0")"
if [ "$name" = mise ]; then name="$2"; fi
printf '%s\\n' "$name" >> "$TRACE"
if [ "$name" = "\${WAIT_FOR:-}" ]; then
  printf ready > "$READY"
  sleep 60
fi
if [ "$name" = "\${FAIL_CHECK:-}" ]; then exit 7; fi
`;
  for (const name of ["mise", "codebase", "readme", "git"]) {
    await writeFile(join(dir, name), executable, { mode: 0o700 });
  }
  const trace = join(dir, "trace");
  const ready = join(dir, "ready");
  const env = {
    ...process.env,
    PATH: `${dir}:${process.env.PATH}`,
    MISE_CONFIG_ROOT: dir,
    CODEBASE: join(dir, "codebase"),
    README: join(dir, "readme"),
    TRACE: trace,
    READY: ready,
    TMPDIR: dir,
    usage_verbose: "false",
  };
  return { dir, trace, ready, env };
}

const inventory = [
  "typecheck",
  "test",
  "generate-check",
  "format-check",
  "codebase",
  "readme",
  "git",
];
describe("validation aggregate", () => {
  test("runs the complete inventory and publishes a terminal PASS", async () => {
    const f = await fixture();
    try {
      const p = Bun.spawn(["bash", gate], {
        env: f.env,
        stdout: "pipe",
        stderr: "pipe",
      });
      const output = await new Response(p.stdout).text();
      expect(await p.exited).toBe(0);
      expect((await readFile(f.trace, "utf8")).trim().split("\n")).toEqual(
        inventory,
      );
      const logs = output.match(/Validation logs: (.+)/)![1];
      expect(await readFile(join(logs, "report.tsv"), "utf8")).toContain(
        "run\tPASS\t0",
      );
    } finally {
      await rm(f.dir, { recursive: true, force: true });
    }
  });

  test("collects independent peers after failure and returns nonzero", async () => {
    const f = await fixture();
    try {
      const p = Bun.spawn(["bash", gate], {
        env: { ...f.env, FAIL_CHECK: "typecheck" },
        stdout: "pipe",
        stderr: "pipe",
      });
      const output = await new Response(p.stdout).text();
      expect(await p.exited).toBe(1);
      expect((await readFile(f.trace, "utf8")).trim().split("\n")).toEqual(
        inventory,
      );
      const logs = output.match(/Validation logs: (.+)/)![1];
      expect(await readFile(join(logs, "report.tsv"), "utf8")).toContain(
        "types\tFAIL\t7",
      );
      expect(await readFile(join(logs, "report.tsv"), "utf8")).toContain(
        "run\tFAIL\t1",
      );
    } finally {
      await rm(f.dir, { recursive: true, force: true });
    }
  });

  test("interruption contains the active group and admits no later checks", async () => {
    const f = await fixture();
    const p = Bun.spawn(["bash", gate], {
      env: { ...f.env, WAIT_FOR: "test" },
      stdout: "pipe",
      stderr: "pipe",
    });
    try {
      let ready = false;
      for (let i = 0; i < 100; i++) {
        try {
          ready = (await readFile(f.ready, "utf8")) === "ready";
        } catch {}
        if (ready) break;
        await Bun.sleep(20);
      }
      expect(ready).toBe(true);
      p.kill("SIGTERM");
      const output = await new Response(p.stdout).text();
      expect(await p.exited).toBe(143);
      expect((await readFile(f.trace, "utf8")).trim().split("\n")).toEqual([
        "typecheck",
        "test",
      ]);
      const logs = output.match(/Validation logs: (.+)/)![1];
      const report = await readFile(join(logs, "report.tsv"), "utf8");
      expect(report).toContain("run\tINTERRUPTED\t143");
      expect(report).toContain("generation\tNOT-RUN");
    } finally {
      if (p.exitCode === null) p.kill();
      await p.exited;
      await rm(f.dir, { recursive: true, force: true });
    }
  }, 10000);
});
