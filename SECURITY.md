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
| `package.json`: "Unpinned Dependencies" (×6, `^` version ranges) | Accepted: standard npm convention, not a pinned-lockfile ecosystem like pip |
| `README.md`: "MCP server referenced without pinned version" (`npx -y ...`) | Accepted: matches how most MCP servers are configured (see this project's own examples), trades pin-and-audit for automatic patch updates |

If you find an actual issue, please open a GitHub issue or a security
advisory on this repository.
