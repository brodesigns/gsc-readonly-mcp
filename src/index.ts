#!/usr/bin/env node
import { createRequire } from "node:module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerListSitesTool } from "./tools/listSites.js";
import { registerListSitemapsTool } from "./tools/listSitemaps.js";
import { registerSearchAnalyticsTool } from "./tools/searchAnalytics.js";
import { registerInspectUrlTool } from "./tools/inspectUrl.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

const server = new McpServer({
  name: "gsc-readonly-mcp",
  version,
});

registerListSitesTool(server);
registerListSitemapsTool(server);
registerSearchAnalyticsTool(server);
registerInspectUrlTool(server);

const transport = new StdioServerTransport();
await server.connect(transport);
