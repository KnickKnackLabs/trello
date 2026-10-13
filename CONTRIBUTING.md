# Working on Trello

This is a source-installed CLI, not a server. Keep public commands safe and readable; do not introduce rental-specific data or workflows here.

## Start

```sh
mise trust
mise install
mise exec -- bun install --frozen-lockfile
mise run doctor
mise run validate
```

`bun` is the only runtime dependency. TypeScript, Prettier, Codebase, and Readme are development tools. Credentials are unnecessary for validation; never commit credentials, API responses, client addresses, or private payloads.

## Change the right source

- `src/arguments.ts`: flags, route substitution, help.
- `src/prepare-request.ts`: payload loading and multipart construction. Caller-relative files use `TRELLO_CALLER_PWD`, evaluated at request time.
- `src/api.ts`: authenticated transport, timeouts, and download policy. Never automatically retry a write.
- `src/run-endpoint.ts` and `src/write-response.ts`: execution and output.
- `scripts/generate.ts`: executable endpoint tasks and catalog.
- `scripts/schema.ts`: official schema URL, checksum, cache verification.
- `README.tsx`: README source; run `readme build` after editing it.

Generated `.mise/tasks/api/` and `spec/endpoints.json` stay committed so installed commands need neither the schema nor generation. The raw `spec/trello.openapi.json` is ignored. `mise run schema:fetch` retrieves it on demand and refuses a checksum mismatch. A schema update is deliberate: review upstream changes, update the URL/checksum, regenerate, and inspect additions/removals. Never silently accept a changed upstream file.

## Validation contract

`mise run validate` is the acceptance gate; `check` is its compatibility alias. CI uses exactly `mise run validate --verbose` on Ubuntu and macOS. Native Bun tests remain the test system; adding BATS is not required.

The aggregate runs independent checks serially and retains every outcome. It contains each active process group before starting the next check and publishes the final whole-run verdict only after cleanup. It records private logs, command receipts, per-check results, and `report.tsv` at the printed temporary directory. A failure, interruption, or uncertain cleanup cannot report PASS. Checks must not daemonize or create detached process groups. Logs are private, not redacted.

Tests isolate temporary files and mock transports, never real account writes. Public-boundary tests cover help/output, caller-relative JSON and upload paths, and failure propagation. Tests for the aggregate cover check inventory, independent failure collection, and interruption. Keep those contracts if adding checks. A dependent check must explicitly require its prerequisite to succeed; do not admit it merely because the aggregate proceeds after an independent failure.

`codebase pre-commit` is an optional clone-local hook; doctor reports its presence but does not install it. Hosted CI remains authoritative release evidence.

## Release

Publish reviewed source and a signed annotated semver tag only after local validation and green hosted CI. Release source contains no raw upstream schema. Register `trello` in the Shiv source index, then prove a fresh `mise` consumer can install the tag and run the installed shim from an unrelated directory. Check relative payload paths as well as help; source-direct tests alone do not prove packaging.

No live writes, permission changes, or credential provisioning are implied by releasing the CLI.
