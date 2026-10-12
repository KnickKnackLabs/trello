# API schema provenance

The upstream OpenAPI document is a development input, **not tracked in Git**.
Fetch it only when generating or validating the catalog:

```sh
mise run schema:fetch
mise run generate
```

The task downloads from Atlassian's official URL:
<https://dac-static.atlassian.com/cloud/trello/swagger.v3.json?_v=1.1274.0>

This URL was linked by the official
[Actions reference](https://developer.atlassian.com/cloud/trello/rest/api-group-actions/).
The October 9, 2026 snapshot is pinned by SHA-256:
`b07c97d06e93f7caff661a307e86f2b58c1f97591614ac8179f8e31bda27334b`.
The internal API version `0.0.1` is not a useful snapshot date. A checksum mismatch
fails without replacing the cache; changing the pin requires explicit review.
The cache is `spec/trello.openapi.json`, covered by `.gitignore`. Installed CLI
commands use generated metadata and never need this file or the fetch task.

`endpoints.json` contains normalized API facts: methods, paths, argument types,
required fields, and body field names. Help descriptions are generated from
method/path/parameter names, not copied upstream prose. The catalog has 261
operations: 128 GET, 45 POST, 51 PUT, and 37 DELETE.

Path-item and operation parameters are merged. Missing path placeholders are
inferred; binary query parameters become multipart file parameters. JSON body
field names and top-level requirements are retained for help and validation.
Unsupported body content types stop generation.

The upstream schema has no separate license declared in its `info` object.
On-demand retrieval avoids bundling the raw document in this repository; it
does not assert a license grant for that third-party document.
