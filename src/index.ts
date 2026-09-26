import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerListSitesTool } from "./tools/listSites.js";
import { registerListSitemapsTool } from "./tools/listSitemaps.js";
import { registerSearchAnalyticsTool } from "./tools/searchAnalytics.js";
import { registerInspectUrlTool } from "./tools/inspectUrl.js";

const server = new McpServer({
  name: "gsc-readonly",
  version: "1.0.0",
});

registerListSitesTool(server);
registerListSitemapsTool(server);
registerSearchAnalyticsTool(server);
registerInspectUrlTool(server);

const transport = new StdioServerTransport();
await server.connect(transport);
