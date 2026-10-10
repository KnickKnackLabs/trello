# Trello

An API-shaped Trello CLI using mise file tasks and Bun/TypeScript.
All **128 GET operations** in the pinned Trello API schema have executable tasks.
There are no write commands. The friendly `boards:list` alias is kept too.

## Setup

```sh
mise install
mise exec -- bun install
```

Export `TRELLO_API_KEY` and `TRELLO_TOKEN` in your shell, or copy `.env.example`
to `.env` and fill it in. Bun loads `.env` when running from the project directory.
The token is secret; `.env` is gitignored. No OAuth client secret is needed.

To obtain credentials, create an app at <https://trello.com/apps/admin>, open
**Trello Auth**, generate an API key, and follow its **Token** link. Review the
permissions before authorizing. Read access suffices for normal board browsing.
Some GET operations require additional permissions or Trello subscription tiers;
this CLI does not grant them or change your token's scope.

## Usage

```sh
mise tasks ls --local
mise run boards:list
mise run api:members:by-id:boards:get -- --id me --fields name,url
mise run api:boards:by-id:lists:get -- --id BOARD_ID
mise run api:boards:by-id:cards:get -- --id BOARD_ID
mise run api:boards:by-boardId:actions:get -- --boardId BOARD_ID --limit 10
mise run api:actions:by-id:get -- --help
mise run api:search:get -- --query 'login bug' --cards_limit 10
```

Generated tasks live under `api:*`, leaving top-level domains for workflow
commands. Beneath that namespace, the tree follows the API path literally: `{id}` becomes `by-id`, and
`get` marks the HTTP method. Placeholder names retain Trello's spelling, so
`--id`, `--boardId`, and `--idAction` are distinct. See the complete
[inventory](docs/endpoints.md) or pass `--help` to an endpoint task. Help requires
neither credentials nor network access.

Options accept `--name value` or `--name=value`. Booleans need explicit
`true`/`false`; arrays use comma-separated values. Unknown flags, missing required
values, and duplicates fail before making a request. Defaults are left to Trello.
Enums and most semantic constraints are validated by the API, not this CLI.

Some reference entries omit supported query parameters. Pass these deliberately:

```sh
mise run api:cards:by-id:actions:get -- --id CARD_ID --param limit=10 --param before=ACTION_ID
```

`--param NAME=VALUE` is repeatable for distinct query names. It cannot override
credentials or provide path placeholders. Known numeric/boolean parameters still
receive the same validation when passed this way.

### Output and pagination

JSON responses are pretty-printed to stdout; plain-text field responses are
preserved. Errors go to stderr and set exit code 1. HTTP errors report only the
status (including 429); response bodies and authenticated URLs are not dumped.
No automatic retries or account-wide traversal occur.

Each command returns **one API page**. Use the endpoint's `limit`, `before`,
`since`, `page`, or cursor parameters to paginate. A missing pagination flag in
the schema can be supplied through `--param`.

Export downloads stream binary bytes to stdout. Redirects are only followed for
that download endpoint, over HTTPS, with API key/token query parameters removed:

```sh
mise run api:boards:by-id:exports:by-idExport:download:get -- --id BOARD_ID --idExport EXPORT_ID > export.zip
```

An export must already exist; this tool cannot create one. A failed stream can
leave a partial output file. Do not print binary downloads directly to a terminal.

Token-inspection endpoints may return sensitive information. Treat their output
as private. Passing a token as a path argument can also put it into shell history
and process listings. API tokens normally belong in environment variables.

## Development

```sh
mise run check          # types + offline tests + generation + formatting checks
mise run generate       # regenerate from the checked-in schema, no network
mise run format         # format authored code/docs (not generated artifacts)
```

- `mise-tasks/` — thin executable endpoint tasks; generated files are marked.
- `src/arguments.ts` — flag parsing, validation, URL substitution, help.
- `src/api.ts` — GET-only HTTP client, auth, timeouts, safe download redirects.
- `src/run-endpoint.ts` — task execution and output handling.
- `scripts/generate.ts` — pinned schema → task files, catalog, inventory.
- `spec/` — schema snapshot and generated catalog; [provenance](spec/README.md).
- `tests/` — offline coverage and behavior tests; no real credentials needed.

Edit shared behavior or the generator, not individual generated tasks. The
hand-written `boards:list` task aliases the member-board endpoint with `id=me`.
Generation checks fail if a generated task's metadata, contents, or executable
permission drift. Run all checks after updating the schema; inspect added and
removed paths rather than assuming a schema refresh is harmless.

Shiv packaging, OAuth 2.0 login, automatic pagination, and name lookup are deferred.
See [implementation notes](docs/implementation-notes.md) for validation and limits.
