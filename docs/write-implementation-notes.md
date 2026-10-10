# Full API implementation — 2026-10-09

## Scope

The pinned official schema contains **261 operations**: 128 GET, 45 POST,
51 PUT, and 37 DELETE. Every method/path pair has an executable `api:*` task.
The transport supports PATCH too, but the snapshot has no PATCH operations to
generate. No guessed endpoints were added.

This work follows a separate namespace migration commit. Top-level domains
remain available for hand-written workflow commands; only `boards:list` exists
there today. Shiv packaging and domain write conveniences are still deferred.

## Request behavior

- Query/path options follow the schema, including inferred missing placeholders.
- All writes accept inline/file JSON object bodies. Top-level required body
  fields are checked, and known query-style fields can be supplied through JSON
  when the upstream endpoint supports that encoding. Nested/alternative schema
  validation is left to Trello. Unknown JSON fields are not rejected.
- Eight binary-parameter endpoints accept local files as multipart uploads.
  Upstream incorrectly locates these parameters in the query; file paths are
  never forwarded as query values. Files are read before HTTP and multipart
  boundaries are set by fetch. Uploads are buffered in memory; no upload-size
  cap is imposed locally. Trello still enforces its own size/type constraints.
- JSON and uploads cannot be mixed. Query/JSON duplicates are rejected, as are
  credentials supplied through either escape hatch.
- An injected general API client owns method/body transport. A separate narrow
  read-client interface remains available and always enforces GET at runtime.
- Writes execute immediately, with no confirmation, dry run, retries, redirects,
  or rollback. Network failures have uncertain outcomes and explicitly tell the
  caller to check state before retrying.
- Empty successful responses emit nothing; JSON/text/download response behavior
  is shared rather than repeated inside task files.

## Validation

- Exact schema coverage across all methods; 128 reads preserved, 133 writes added.
- Every one of the 261 real task entry points invoked with help, without
  credentials. Write help contains a mutation warning.
- Every endpoint exercised with a mock client, checking method, substituted path,
  one operation, and payload presence where required.
- Create-card, comment, and move-card argument encoding tested.
- Inline/file JSON, nested custom fields, required body fields, invalid JSON,
  missing files, duplicate fields, and forbidden combinations tested.
- All eight upload routes tested with multipart bytes and filename preservation.
- A loopback HTTP server test verifies real fetch multipart encoding/boundaries.
  Only dummy credentials are used; this never contacts Trello.
- POST/PUT/DELETE/PATCH transport, no-retry failures/redirects, and narrow read
  capability enforcement tested, alongside the existing read/error/download tests.
- TypeScript, formatting, generation consistency, and mise task validation checked.

**No live Trello mutation has been performed.** The seven earlier live GET smokes
are recorded in the initial implementation notes. Coverage proves local task
wiring and request construction, not account permissions or end-to-end success
for every endpoint. Live write validation needs separately approved disposable
resources and an explicit cleanup plan.

## Remaining limitations / review targets

- OAuth 2.0 login/refresh is not implemented. Existing auth uses Trello key/token;
  app/enterprise/export/billing operations may need other auth, permissions, or tiers.
- The schema is imperfect. Generation uses HTTP method keys, not operation IDs;
  query omissions have `--param`, body omissions have explicit JSON inputs.
  Neither escape hatch guarantees upstream support for arbitrary fields.
- No automatic pagination, retries, optimistic concurrency, or collaborative
  conflict resolution. Workflows must avoid overwriting another contributor's
  edits blindly; generic API access is not a collaboration policy.
- CLI arguments can appear in mise output, shell history, and process listings.
  Body files reduce accidental disclosure of payloads; keep credentials in env.
- Nested JSON types/enums and response schemas are not validated locally.
- Upload MIME inference uses the filename. Large uploads consume memory.
- Upstream schema redistribution terms still need confirming before publication.

For human review, start with `src/prepare-request.ts`, `src/api.ts`,
`src/run-endpoint.ts`, `src/write-response.ts`, and `tests/write-requests.test.ts`.
The generated task files and catalog are mechanical outputs of the generator.
