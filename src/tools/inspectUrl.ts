import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { inspectUrl } from "../gscClient.js";
import { defaultSiteUrl } from "../util.js";

export function registerInspectUrlTool(server: McpServer) {
  server.registerTool(
    "inspect_url",
    {
      title: "Inspect URL",
      description:
        "Checks the index status of a single URL: is it indexed, what issues does Google report, mobile usability, canonical URL.",
      inputSchema: {
        site_url: z.string().optional().describe("Falls back to GSC_SITE_URL if omitted."),
        inspection_url: z.string().describe("Full URL to inspect."),
      },
    },
    async ({ site_url, inspection_url }) => {
      const siteUrl = defaultSiteUrl(site_url);
      const data = await inspectUrl(siteUrl, inspection_url);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
