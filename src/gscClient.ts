import { getAuth } from "./auth.js";

const WEBMASTERS_BASE = "https://www.googleapis.com/webmasters/v3";
const SEARCHCONSOLE_BASE = "https://searchconsole.googleapis.com/v1";

async function authedRequest<T>(url: string, method: "GET" | "POST", body?: unknown): Promise<T> {
  const client = await getAuth().getClient();
  const res = await client.request<T>({
    url,
    method,
    data: body,
  });
  return res.data;
}

export function listSites() {
  return authedRequest(`${WEBMASTERS_BASE}/sites`, "GET");
}

export function listSitemaps(siteUrl: string) {
  const encoded = encodeURIComponent(siteUrl);
  return authedRequest(`${WEBMASTERS_BASE}/sites/${encoded}/sitemaps`, "GET");
}

export interface SearchAnalyticsQuery {
  startDate: string;
  endDate: string;
  dimensions?: string[];
  rowLimit?: number;
  dimensionFilterGroups?: unknown[];
}

export function queryAnalytics(siteUrl: string, query: SearchAnalyticsQuery) {
  const encoded = encodeURIComponent(siteUrl);
  return authedRequest(
    `${WEBMASTERS_BASE}/sites/${encoded}/searchAnalytics/query`,
    "POST",
    query,
  );
}

export function inspectUrl(siteUrl: string, inspectionUrl: string) {
  return authedRequest(`${SEARCHCONSOLE_BASE}/urlInspection/index:inspect`, "POST", {
    siteUrl,
    inspectionUrl,
  });
}
