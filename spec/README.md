# API schema provenance

`trello.openapi.json` is Atlassian's published Trello OpenAPI v3 document,
downloaded on 2026-10-09 from:

<https://dac-static.atlassian.com/cloud/trello/swagger.v3.json?_v=1.1274.0>

This URL was linked by the official [Actions reference](https://developer.atlassian.com/cloud/trello/rest/api-group-actions/).
The document's internal API version is `0.0.1`; it is not a meaningful snapshot
date. The checked-in bytes, rather than the remote URL, are the generation input.
Their SHA-256 is `b07c97d06e93f7caff661a307e86f2b58c1f97591614ac8179f8e31bda27334b`.

`read-endpoints.json` is generated metadata for every GET operation in that
snapshot. Its 128 entries correspond one-to-one to GET paths, regardless of the
operation ID (some operation IDs misleadingly start with `post`).

Path-item and operation parameters are merged, with the operation overriding
matching path-item declarations. Missing placeholder declarations are inferred
from the route. All generated routes are rooted at the schema's `/1` API version.

This schema is upstream reference data, not our authored code. No separate
license is declared in its `info` object. Confirm upstream redistribution terms
before public publication. No GitHub repo or release has been created.
