<div align="center">

# trello

![endpoints: 261](https://img.shields.io/badge/endpoints-261-blue?style=flat)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat)](LICENSE)

</div>

Read and write Trello boards, lists, and cards from the terminal. Commands mirror the Trello API; responses are printed as JSON.

## Install

```bash
shiv install trello
```

Or declare it for a project in `mise.toml`:

```toml
[plugins]
shiv = "https://github.com/KnickKnackLabs/vfox-shiv"

[tools]
"shiv:trello" = "0.1"
```

```bash
mise install
```

Get an API key and token from [Trello Auth](https://trello.com/apps/admin), then export `TRELLO_API_KEY` and `TRELLO_TOKEN` in your shell. Keep them out of Git and command arguments.

## Run

```bash
# List your boards, then read a board's cards.
trello boards:list
trello api:boards:by-id:cards:get -- --id BOARD_ID

# Find commands and inspect their arguments.
trello tasks
trello api:cards:post -- --help

# Create a card from a JSON file containing idList, name, and optional desc.
trello api:cards:post -- --body-file card.json

# Attach a local file to a card.
trello api:cards:by-id:attachments:post -- --id CARD_ID --file screenshot.png
```

Use `--` before endpoint arguments so mise passes them to the command, including `--help`.

<details>
<summary><b>Operational notes</b></summary>

- Writes happen immediately. There is no confirmation, dry run, rollback, or automatic retry. After a timeout, check the result before trying again.
- Each GET returns one page. Pagination is caller-controlled.
- Relative JSON and upload paths resolve from your calling directory. Use private body files instead of putting sensitive payloads in arguments.
- Errors go to stderr with a nonzero exit status. Empty successful responses print nothing; download endpoints stream bytes, so redirect them to a file.
- `--param NAME=VALUE` supplies query parameters missing from the reference schema. Nested JSON validation is left to Trello.

</details>

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, tests, and generation. Installed commands need only Bun; the upstream schema is fetched and checksum-verified for development, not shipped with the CLI.

<div align="center">

---

<sub>
Generated with <a href="https://github.com/KnickKnackLabs/readme">readme</a>
</sub></div>
