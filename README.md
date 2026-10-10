# Trello

An API-shaped Trello CLI using mise file tasks and Bun/TypeScript.
All **261 operations** in the pinned official API schema have executable tasks:
128 GET, 45 POST, 51 PUT, and 37 DELETE. Generated tasks live under `api:*`;
top-level domains are reserved for workflow commands. `boards:list` remains a
convenience alias for the current user's boards.

## Setup

```sh
mise install
mise exec -- bun install
```

Export `TRELLO_API_KEY` and `TRELLO_TOKEN` in your shell, or copy `.env.example`
to `.env` and fill it in. Bun loads `.env` when running from the project directory.
The token is secret; `.env` is gitignored. No OAuth client secret is needed.

Create an app at <https://trello.com/apps/admin>, open **Trello Auth**, generate
an API key, and follow its **Token** link. Review the requested permissions:
read-only tokens cannot write. Some endpoints also need app ownership,
additional permissions, OAuth 2.0, or a paid Trello tier. This CLI does not grant
permissions or change your token's scope.

## Browsing

```sh
mise tasks ls --local
mise run boards:list
mise run api:members:by-id:boards:get -- --id me --fields name,url
mise run api:boards:by-id:lists:get -- --id BOARD_ID
mise run api:boards:by-id:cards:get -- --id BOARD_ID
mise run api:boards:by-boardId:actions:get -- --boardId BOARD_ID --limit 10
mise run api:search:get -- --query 'login bug' --cards_limit 10
```

The task tree follows literal API routes: `{id}` becomes `by-id`, and the final
segment is the HTTP method. Placeholder names retain Trello's spelling, so
`--id`, `--boardId`, and `--idAction` are distinct. See the complete
[inventory](docs/endpoints.md) or ask an endpoint for help:

```sh
mise run api:cards:post -- --help
```

Help needs neither credentials nor network access, and does not mutate anything.

## Writing

**POST, PUT, and DELETE tasks act immediately.** There are no confirmation
prompts, automatic retries, dry-run mode, or rollback. A timeout does not prove a
write failed: check the resulting state before retrying. Test against a dedicated
board, and be particularly careful with delete, account, membership, and billing
operations. Generated help marks non-GET commands with a warning.

Examples below use placeholder IDs; replace them deliberately:

```sh
# Create a card.
mise run api:cards:post -- --idList LIST_ID --name 'Rental candidate' --desc 'Pet policy needs checking'

# Add a comment.
mise run api:cards:by-id:actions:comments:post -- --id CARD_ID --text 'Listing says cats allowed; confirm fees.'

# Move a card by updating its list.
mise run api:cards:by-id:put -- --id CARD_ID --idList DESTINATION_LIST_ID

# Attach a local file (multipart upload, not a file path sent in the query).
mise run api:cards:by-id:attachments:post -- --id CARD_ID --file screenshot.png
```

### Arguments and JSON bodies

Options accept `--name value` or `--name=value`. Booleans need explicit
`true`/`false`; query arrays use comma-separated values. Unknown flags, missing
required values, and duplicates fail before making a request. Defaults are left
to Trello. Enums, nested JSON schemas, and most semantic constraints are validated
by the API, not this CLI.

Non-GET commands accept either `--body-json JSON` or `--body-file FILE` for a JSON
object request body. JSON files must be regular files and contain an object:

```sh
# card.json contains {"idList":"LIST_ID","name":"Rental candidate","desc":"..."}
mise run api:cards:post -- --body-file card.json

# Nested custom-field payloads retain their structure.
mise run api:cards:by-idCard:customField:by-idCustomField:item:put -- \
  --idCard CARD_ID --idCustomField FIELD_ID --body-json '{"value":{"text":"Cats allowed"}}'
```

Required query-style fields may be supplied in the JSON body where the API
supports that encoding (as card creation does). Fields cannot appear in both the
query and JSON body. Documented required body fields are checked at the top
level; alternative/nested schema constraints remain server-side. The CLI permits
JSON bodies on other write endpoints as an explicit escape hatch, not a guarantee
that every upstream endpoint accepts them.

Binary parameters (`--file`, or `--fileSource` for card creation) read local files
and build multipart bodies automatically. JSON bodies and uploads are mutually
exclusive. Other declared parameters retain their documented query locations.
Upload MIME types are inferred from the filename; Trello enforces upload limits.

Some reference entries omit supported query parameters. Supply them deliberately:

```sh
mise run api:cards:by-id:actions:get -- --id CARD_ID --param limit=10 --param before=ACTION_ID
```

`--param NAME=VALUE` is repeatable for distinct query names. It cannot override
credentials or supply path/file parameters. Known numeric/boolean parameters
receive the same validation with this spelling. Credentials must not appear in
JSON bodies either.

### Output, pagination, and downloads

JSON responses are pretty-printed to stdout; plain-text field responses are
preserved. Successful empty responses emit nothing. Errors go to stderr with
exit code 1. HTTP errors report only the status (including 429); response bodies
and authenticated URLs are not dumped. Inputs and payloads are not logged by the
CLI, although mise displays command arguments and shell history can record them.
Use body files/environment variables for sensitive values where possible.

Each GET command returns **one API page**. Use the endpoint's `limit`, `before`,
`since`, `page`, or cursor parameters to paginate. No account-wide traversal occurs.

Export downloads stream binary bytes to stdout. Redirects are followed only for
that GET download endpoint, over HTTPS, with API key/token query parameters
removed. Write requests never follow redirects or retry:

```sh
mise run api:boards:by-id:exports:by-idExport:download:get -- --id BOARD_ID --idExport EXPORT_ID > export.zip
```

An export must already exist. A failed stream can leave a partial output file.
Do not print binary downloads directly to a terminal.

Token-inspection endpoints may return sensitive information. Treat that output
as private. A token supplied as a path argument can enter shell history/process
listings. Auth tokens normally belong in environment variables.

## Development

```sh
mise run check          # types + offline tests + generation + formatting checks
mise run generate       # regenerate from the checked-in schema, no network
mise run format         # format authored code/docs (not generated artifacts)
```

- `mise-tasks/api/` — generated executable endpoint tasks with visible metadata.
- `src/arguments.ts` — argument parsing, validation, URL substitution, help.
- `src/prepare-request.ts` — JSON/file loading and payload construction.
- `src/api.ts` — HTTP methods, auth, timeouts, safe download redirects; no retries.
- `src/write-response.ts` — JSON/text/binary output handling.
- `src/run-endpoint.ts` — task orchestration and error reporting.
- `scripts/generate.ts` — pinned schema → task files, catalog, inventory.
- `spec/` — schema snapshot and generated catalog; [provenance](spec/README.md).
- `tests/` — offline tests, including local HTTP upload tests; no real credentials.

Edit shared behavior or the generator, not individual generated tasks. The
hand-written `boards:list` alias selects the GET member-board endpoint with `id=me`.
Generation checks catch task metadata/content/executable drift. Obsolete generated
tasks must be reviewed and removed explicitly during a schema refresh.

Shiv packaging, domain workflow commands, OAuth 2.0 login, automatic pagination,
and name lookup are deferred. See [write implementation notes](docs/write-implementation-notes.md)
for validation and limitations, and [initial read implementation notes](docs/implementation-notes.md)
for the original live-read validation.
