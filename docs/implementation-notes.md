# Initial read-only implementation notes — 2026-10-09

This records the initial read-only implementation. Subsequent changes moved the
literal tasks under `api:*` and added writes; see [write implementation notes](write-implementation-notes.md).
The original live-read results below remain useful evidence, not a current claim
that the tool is read-only.

## Scope and design

Implemented all 128 GET operations from the official schema snapshot, not just
the Actions group. There are no HEAD operations in that snapshot. POST, PUT,
and DELETE operations are deliberately excluded. GET classification follows
Trello's reference; it does not imply every endpoint has a read-only OAuth scope
or that the server performs no incidental logging/state bookkeeping.

The endpoint task tree mirrors literal API routes. This makes task names longer
than a hand-designed CLI, but avoids ambiguous names and keeps coverage auditable.
`boards:list` remains a convenience alias for the current user's boards.

A schema-driven generator was chosen instead of independently writing 128 request
implementations. Each endpoint has its own executable file and visible metadata;
argument parsing, HTTP safety, and output handling have one shared owner each.
The pinned schema makes generation offline and repeatable. It does not download
upstream changes during normal checks.

## Validation performed

- Exact equality between GET routes in the schema and the generated catalog.
- Each generated file's contents and executable permissions checked.
- Every one of the 128 real Bun task entry points invoked with `--help`, without credentials.
- Every endpoint executed with an injected mock client, checking path substitution
  and exactly one request.
- Argument failures, escaping, required values, boolean/numeric validation,
  extra query parameters, and duplicate rejection tested.
- HTTP status and network failures, origin restrictions, HTTPS-only download
  redirects, credential stripping, redirect limits, JSON/text/binary output tested.
- TypeScript check and generation consistency check passed.
- Live smoke: seven successful GET calls — board listing, current member,
  one board's lists, one card from that board, one board action, and individual
  reads of that card and action. Only success/counts were printed; credentials
  and board/card names were not printed or saved as fixtures.

Live validation is representative, **not** proof that every endpoint works with
this account. Enterprise, app compliance, exports, reactions, custom assets,
webhooks, and token-inspection routes need suitable IDs/permissions to test.
They have offline coverage but have not been exercised against your account.

## Decisions left for Or

- The literal `by-id` / `by-boardId` task naming is consistent but verbose.
  Decide whether friendly aliases are worth adding after using the core.
- The reference is incomplete in places. Missing path declarations are inferred;
  missing query declarations are supported through `--param`. This escape hatch
  forwards values, not a claim that the server supports every possible parameter.
- Responses are not validated against OpenAPI response schemas. Most commands
  emit JSON; individual field endpoints can emit text, and downloads emit bytes.
- Pagination is caller-controlled. No retries, auto-pagination, or bulk account
  scans were added.
- Auth uses the existing Trello key/token flow. OAuth 2.0 login and refresh-token
  lifecycle are not implemented. Some new GET endpoints may require OAuth 2.0,
  extra scopes, app ownership, or paid-tier permissions. Errors report the status.
- Export downloads follow up to five HTTPS redirects and remove key/token query
  parameters before following them. They require an already-created export.
  A failed download may leave partial output; use a temporary file when important.
- Upstream schema redistribution terms need confirming before publication.
- Shiv packaging, CI, repo creation, public publication, and release work are not
  included. Everything remains local.

## Continuing

Run `mise run check` for the offline quality gate. Use `mise run format` for
authored files and `mise run generate` for generated tasks. Generation refuses
obsolete marked tasks rather than silently deleting files; review removed
upstream routes and remove obsolete files explicitly during a schema refresh.

See `docs/endpoints.md` for the complete endpoint-to-task map and `spec/README.md`
for provenance. Generated task files should not be edited directly.
