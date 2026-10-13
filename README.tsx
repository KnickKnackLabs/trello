/** @jsxImportSource jsx-md */
import { readFileSync } from "node:fs";
import {
  Badge,
  Badges,
  Center,
  Code,
  CodeBlock,
  Details,
  Heading,
  HR,
  Item,
  Link,
  List,
  Paragraph,
  Raw,
  Section,
  Sub,
} from "readme";

const endpoints = JSON.parse(
  readFileSync(new URL("./spec/endpoints.json", import.meta.url), "utf8"),
) as unknown[];

console.log(
  <>
    <Center>
      <Heading level={1}>trello</Heading>
      <Badges>
        <Badge label="endpoints" value={`${endpoints.length}`} color="blue" />
        <Badge label="license" value="MIT" color="blue" href="LICENSE" />
      </Badges>
    </Center>

    <Paragraph>
      Read and write Trello boards, lists, and cards from the terminal. Commands
      mirror the Trello API; responses are printed as JSON.
    </Paragraph>

    <Section title="Install">
      <CodeBlock lang="bash">{`shiv install trello`}</CodeBlock>
      <Paragraph>
        Or declare it for a project in <Code>mise.toml</Code>:
      </Paragraph>
      <CodeBlock lang="toml">{`[plugins]
shiv = "https://github.com/KnickKnackLabs/vfox-shiv"

[tools]
"shiv:trello" = "0.1"`}</CodeBlock>
      <CodeBlock lang="bash">{`mise install`}</CodeBlock>
      <Paragraph>
        Get an API key and token from{" "}
        <Link href="https://trello.com/apps/admin">Trello Auth</Link>, then
        export <Code>TRELLO_API_KEY</Code> and <Code>TRELLO_TOKEN</Code> in your
        shell. Keep them out of Git and command arguments.
      </Paragraph>
    </Section>

    <Section title="Run">
      <CodeBlock lang="bash">{`# List your boards, then read a board's cards.
trello boards:list
trello api:boards:by-id:cards:get -- --id BOARD_ID

# Find commands and inspect their arguments.
trello tasks
trello api:cards:post -- --help

# Create a card from a JSON file containing idList, name, and optional desc.
trello api:cards:post -- --body-file card.json

# Attach a local file to a card.
trello api:cards:by-id:attachments:post -- --id CARD_ID --file screenshot.png`}</CodeBlock>
      <Paragraph>
        Use <Code>--</Code> before endpoint arguments so mise passes them to the
        command, including <Code>--help</Code>.
      </Paragraph>
    </Section>

    <Details summary="Operational notes">
      <List>
        <Item>
          Writes happen immediately. There is no confirmation, dry run,
          rollback, or automatic retry. After a timeout, check the result before
          trying again.
        </Item>
        <Item>Each GET returns one page. Pagination is caller-controlled.</Item>
        <Item>
          Relative JSON and upload paths resolve from your calling directory.
          Use private body files instead of putting sensitive payloads in
          arguments.
        </Item>
        <Item>
          Errors go to stderr with a nonzero exit status. Empty successful
          responses print nothing; download endpoints stream bytes, so redirect
          them to a file.
        </Item>
        <Item>
          <Code>--param NAME=VALUE</Code> supplies query parameters missing from
          the reference schema. Nested JSON validation is left to Trello.
        </Item>
      </List>
    </Details>

    <Section title="Development">
      <Paragraph>
        See <Link href="CONTRIBUTING.md">CONTRIBUTING.md</Link> for setup,
        tests, and generation. Installed commands need only Bun; the upstream
        schema is fetched and checksum-verified for development, not shipped
        with the CLI.
      </Paragraph>
    </Section>

    <Center>
      <HR />
      <Sub>
        <Raw>{`Generated with <a href="https://github.com/KnickKnackLabs/readme">readme</a>`}</Raw>
      </Sub>
    </Center>
  </>,
);
