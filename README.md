# gsc-readonly-mcp

Read-only [MCP](https://modelcontextprotocol.io/) server for the Google Search
Console API. Search analytics, sitemap status, URL inspection, property
listing, nothing else.

**Design choice: no write scope, not even gated.** No `submit_sitemap`, no
`delete_sitemap`, no way to change anything in Search Console. If you need
those, look elsewhere; this project stays deliberately small so it is easy to
audit in one sitting.

## Tools

| Tool | Does |
|---|---|
| `list_sites` | Lists every property the service account can access |
| `list_sitemaps` | Sitemap status for a property (errors, warnings, indexed count) |
| `search_analytics_query` | Clicks, impressions, CTR, position, grouped by query/page/date/etc. |
| `inspect_url` | Index status, canonical URL, mobile usability for one URL |

## Setup

### 1. Create a service account and download its JSON key

1. [Google Cloud Console](https://console.cloud.google.com/) → create or
   select a project.
2. **APIs & Services → Library** → enable **Search Console API**.
3. **APIs & Services → Credentials → Create Credentials → Service Account**.
4. Open the new service account → **Keys → Add Key → Create new key → JSON**.
   The file downloads automatically.
5. Open the file, note the `client_email` field
   (`...@...iam.gserviceaccount.com`).

### 2. Grant that service account access in Search Console

1. [Search Console](https://search.google.com/search-console/) → open the
   property.
2. **Settings → Users and permissions → Add user**.
3. Paste the `client_email` from step 1. Use **Full** if you need
   `search_analytics_query` (Restricted users hit a permission error on that
   endpoint), **Restricted** is enough for `list_sites`/`list_sitemaps`.

### 3. Store the key file somewhere outside any git repo

```bash
mkdir -p ~/.config/gsc
mv ~/Downloads/your-key-*.json ~/.config/gsc/service-account.json
chmod 600 ~/.config/gsc/service-account.json
```

### 4. Configure your MCP client

**Claude Code:**

```bash
claude mcp add gsc-readonly \
  -e GSC_SERVICE_ACCOUNT_KEY_FILE=~/.config/gsc/service-account.json \
  -e GSC_SITE_URL="https://example.de/" \
  -- npx -y @brodesigns/gsc-readonly-mcp
```

Or in `.mcp.json`:

```json
{
  "mcpServers": {
    "gsc-readonly": {
      "command": "npx",
      "args": ["-y", "@brodesigns/gsc-readonly-mcp"],
      "env": {
        "GSC_SERVICE_ACCOUNT_KEY_FILE": "/absolute/path/to/service-account.json",
        "GSC_SITE_URL": "https://example.de/"
      }
    }
  }
}
```

`GSC_SITE_URL` is optional; every tool also accepts a `site_url` argument that
overrides it, useful if the same MCP server should cover several properties.

**Important:** use the property URL exactly as Search Console shows it.
Domain properties look like `sc-domain:example.de`, URL-prefix properties
look like `https://example.de/`. Passing the wrong form fails silently or
with a permission error even though the account has access.

## Why this exists

Built after a security review of an existing community MCP server for the
same API turned up a high-severity-looking automated scan result (mostly
false positives on legitimate env-var reads, plus non-runtime dev-dependency
CVEs) and a feature set larger than needed for read-only SEO workflows. This
project intentionally covers less ground in exchange for being small enough
to read end to end in a few minutes.

## Security

- Two runtime dependencies: `@modelcontextprotocol/sdk`, `google-auth-library`
  (Google's own, minimal auth client), `zod` for schema validation.
- No write scope requested from Google at all (`webmasters.readonly`).
- No telemetry, no network calls beyond the Google APIs listed above.
- Scanned with [SkillSpector](https://github.com/NVIDIA/SkillSpector) before
  each release; see [SECURITY.md](SECURITY.md) for the latest result, findings
  reviewed by hand.

## License

MIT
