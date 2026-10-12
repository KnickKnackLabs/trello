# Trello

An API-shaped Trello CLI: **261 operations** (128 GET, 45 POST, 51 PUT, 37 DELETE), generated as mise tasks and run with Bun. No runtime npm dependencies, schema downloads, or build step are needed to use the installed commands.

## Install

```sh
mise use shiv:trello@0.1
# Or declare "shiv:trello" = "0.1" under [tools] in mise.toml.
trello --help
trello version
```

Export `TRELLO_API_KEY` and `TRELLO_TOKEN` in the calling shell. Create an app at <https://trello.com/apps/admin>, open **Trello Auth**, generate an API key, and follow its **Token** link. Review token permissions: read-only tokens cannot write. This CLI does not grant access or change permissions. It does not implement OAuth 2.0 login.

Do not put credentials in Git or command arguments. A checkout can use a gitignored `.env` during development; installed consumers should supply environment variables, not edit the installed package.

## Read and write

```sh
trello boards:list
trello api:members:by-id:boards:get -- --id me --fields name,url
trello api:boards:by-id:cards:get -- --id BOARD_ID
trello api:cards:post -- --help
trello api:cards:post -- --body-file card.json
trello api:cards:by-id:attachments:post -- --id CARD_ID --file screenshot.png
```

The [endpoint inventory](docs/endpoints.md) lists every command. Paths retain Trello's placeholder spelling: `--id`, `--boardId`, and `--idCard` are distinct. Use `--` before endpoint arguments (especially `--help`) so mise does not interpret them as its own flags. In a source checkout, use `mise run COMMAND -- ARGUMENTS` instead of `trello COMMAND ARGUMENTS`.

**Writes act immediately.** POST, PUT, and DELETE have no confirmation, retry, dry-run, or rollback. A timeout does not prove a write failed: inspect the resulting state before trying again. Use a dedicated test board for live write experiments. Help requires neither credentials nor network access.

Options accept `--name value` or `--name=value`. Booleans require explicit `true` or `false`; query arrays use comma-separated values. Unknown flags, duplicate arguments, and missing required values fail before a request. Most semantic and nested-schema validation remains server-side.

### JSON and uploads

Non-GET commands accept one JSON object via `--body-json` or `--body-file`. Prefer private body files for sensitive payloads. Required query-style fields can be supplied in the body where Trello supports that encoding:

```json
{"idList":"LIST_ID","name":"Candidate","desc":"Availability unchecked"}
```

For nested custom fields:

```sh
trello api:cards:by-idCard:customFields:put -- --idCard CARD_ID \
  --body-json '{"customFieldItems":[{"idCustomField":"FIELD_ID","value":{"number":"2"}}]}'
```

Relative body/upload paths resolve from the calling directory via Shiv's `TRELLO_CALLER_PWD`; absolute paths remain absolute. In direct source invocation, paths resolve from the process working directory unless that variable is supplied. Files must be regular files. Uploads become multipart requests; they cannot be combined with a JSON body.

The `--param NAME=VALUE` escape hatch supplies upstream-supported query parameters omitted by the reference schema. It cannot override credentials or path/file parameters. JSON bodies are likewise an explicit escape hatch, not a promise every endpoint accepts them.

### Output and safety

JSON goes to stdout; errors go to stderr with exit code 1. Successful empty responses emit nothing. HTTP errors report status only, without authenticated URLs or response bodies. API payloads are not logged by the CLI, but shells/mise may display arguments: keep secrets out of arguments. Token-inspection responses may themselves contain sensitive information.

Each GET returns **one page**. Use the endpoint's limit/cursor/before/since arguments to paginate; no automatic traversal or name lookup occurs. Export-download commands stream binary stdout; redirect to a file, never a terminal. A failed stream can leave a partial file. Only the export download follows HTTPS redirects, stripping credential query parameters; writes never follow redirects or retry.

## Develop

```sh
git clone https://github.com/KnickKnackLabs/trello.git
cd trello
mise trust
mise install
mise exec -- bun install --frozen-lockfile
mise run validate
mise run doctor
```

The native Bun suite tests parsing, requests, uploads, downloads, and endpoint coverage without live credentials. Development validation fetches the pinned public schema on the first run; subsequent cached runs verify its checksum and are offline. The raw schema is ignored, never committed. See [schema provenance](spec/README.md).

```sh
mise run schema:fetch        # Fetch/verify the pinned development input
mise run generate           # Regenerate executable API tasks and inventory
mise run validate --verbose # Same acceptance gate used on Ubuntu/macOS CI
mise run check              # Compatibility alias for validate
mise run format
readme build                # README.tsx -> README.md
```

The gate runs type checks, tests, generation consistency, formatting, Codebase lint, README freshness, and whitespace checks. Independent checks run serially and failures aggregate; the gate owns interruption and process-group cleanup. Private full logs and a final report remain at the printed temporary directory. Logs are private, not redacted; remove them when no longer useful.

- `.mise/tasks/api/`: generated endpoint commands; edit the generator, not these files.
- `src/`: shared argument, request, auth, transport, and output logic.
- `scripts/generate.ts`: generator; `scripts/schema.ts`: verified on-demand input.
- `spec/endpoints.json`: generated operational catalog, not the upstream schema.
- `tests/`: native Bun tests, including public-boundary checks.

[CONTRIBUTING.md](CONTRIBUTING.md) owns the maintainer orientation. Older implementation notes under `docs/` describe historical validation, not the current installation contract.

## License

Authored code is MIT; see [LICENSE](LICENSE). Trello and Atlassian names belong to their respective owners. The upstream schema is retrieved from Atlassian only when explicitly needed for development and is not included in the public repository.

Generated from `README.tsx` with [readme](https://github.com/KnickKnackLabs/readme).
