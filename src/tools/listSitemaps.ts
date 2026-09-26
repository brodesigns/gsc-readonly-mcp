import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listSitemaps } from "../gscClient.js";
import { defaultSiteUrl } from "../util.js";

export function registerListSitemapsTool(server: McpServer) {
  server.registerTool(
    "list_sitemaps",
    {
      title: "List sitemaps",
      description:
        "Lists all sitemaps submitted to Search Console for a property, including status (errors, warnings, indexed count).",
      inputSchema: {
        site_url: z
          .string()
          .optional()
          .describe(
            "Property URL, e.g. 'sc-domain:example.de' or 'https://example.de/'. Falls back to GSC_SITE_URL if omitted.",
          ),
      },
    },
    async ({ site_url }) => {
      const siteUrl = defaultSiteUrl(site_url);
      const data = await listSitemaps(siteUrl);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
