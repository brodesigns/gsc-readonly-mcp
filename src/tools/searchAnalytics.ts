import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { queryAnalytics } from "../gscClient.js";
import { defaultSiteUrl } from "../util.js";

const DIMENSIONS = ["query", "page", "country", "device", "date", "searchAppearance"] as const;

export function registerSearchAnalyticsTool(server: McpServer) {
  server.registerTool(
    "search_analytics_query",
    {
      title: "Query search analytics",
      description:
        "Clicks, impressions, CTR and position for a date range, grouped by dimensions (e.g. query, page). Core tool for SEO decisions.",
      inputSchema: {
        site_url: z.string().optional().describe("Falls back to GSC_SITE_URL if omitted."),
        start_date: z.string().describe("YYYY-MM-DD"),
        end_date: z.string().describe("YYYY-MM-DD"),
        dimensions: z
          .array(z.enum(DIMENSIONS))
          .optional()
          .describe("Default: ['query']"),
        row_limit: z.number().int().min(1).max(25000).optional().describe("Default: 100"),
      },
    },
    async ({ site_url, start_date, end_date, dimensions, row_limit }) => {
      const siteUrl = defaultSiteUrl(site_url);
      const data = await queryAnalytics(siteUrl, {
        startDate: start_date,
        endDate: end_date,
        dimensions: dimensions ?? ["query"],
        rowLimit: row_limit ?? 100,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
