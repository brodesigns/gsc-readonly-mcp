import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listSites } from "../gscClient.js";

export function registerListSitesTool(server: McpServer) {
  server.registerTool(
    "list_sites",
    {
      title: "List Search Console properties",
      description:
        "Lists every Google Search Console property the service account has access to.",
      inputSchema: {},
    },
    async () => {
      const data = await listSites();
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
