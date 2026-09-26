# Security

## Scope

This server only requests the `webmasters.readonly` OAuth scope from Google.
There is no code path that can submit, modify, or delete anything in Search
Console. Two runtime dependencies: `@modelcontextprotocol/sdk` and
`google-auth-library` (Google's own auth client), plus `zod` for input
validation. No telemetry, no network calls beyond the Google APIs this
project talks to.

## Automated scan

Scanned with [SkillSpector](https://github.com/NVIDIA/SkillSpector)
(`skillspector scan . --no-llm`) before each release. Latest result:
**57/100, HIGH, 100% coverage, 11 findings, 0 confirmed real**.

Every finding reviewed by hand:

| Finding | Verdict |
|---|---|
| `.gitignore`: "Credential Access" on the `.env` ignore line | False positive: excluding secret files from git is the recommended practice, not a vulnerability |
| `package-lock.json`: "Possible Typosquatting: gaxios resembles axios" | False positive: `gaxios` is Google's own HTTP client, a transitive dependency of `google-auth-library`, unrelated to `axios` |
| `README.md`: "Session Persistence" on a setup step heading | False positive: pattern match on documentation prose, no code involved |
| `README.md`: "Sudo/Root Execution" on `chmod 600 <key file>` | False positive: this narrows file permissions to owner-only, the opposite of privilege escalation |
| `package.json`: "Unpinned Dependencies" (dev dependencies, `^` ranges) | Accepted for `devDependencies` only; see "Supply chain" below for `dependencies` |
| `README.md`: "MCP server referenced without pinned version" (`npx -y ...`) | Accepted: matches how most MCP servers are configured (see this project's own examples), trades pin-and-audit for automatic patch updates |

## Supply chain

- **Runtime dependencies are pinned to exact versions** (no `^`/`~`), not
  ranges: a `dependabot` PR is required, reviewed, and merged by hand before
  any of `@modelcontextprotocol/sdk`, `google-auth-library`, or `zod` moves,
  even for a patch release. `devDependencies` keep `^` ranges, a compromised
  dev tool cannot ship inside the published package.
- **`npm audit --omit=dev --audit-level=high` runs in CI** on every push and
  PR; a new high/critical advisory in a runtime dependency fails the build.
- **[CodeQL](https://codeql.github.com/)** runs on every push, PR, and weekly
  on a schedule.
- **Releases are published with [npm provenance](https://docs.npmjs.com/generating-provenance-statements)**
  via GitHub Actions using [Trusted Publishing](https://docs.npmjs.com/trusted-publishers)
  (OIDC, no long-lived `NPM_TOKEN` in this repository at all). Verify any
  release with `npm view @brodesigns/gsc-readonly-mcp@<version> --json | grep provenance`
  or the provenance badge on the [npm package page](https://www.npmjs.com/package/@brodesigns/gsc-readonly-mcp).
- **`master` is protected**: no direct pushes, every change goes through a
  pull request with CI and CodeQL passing first.
- **Commits and tags are signed.** Check with `git log --show-signature`.

If you find an actual issue, please open a GitHub issue or a security
advisory on this repository.
