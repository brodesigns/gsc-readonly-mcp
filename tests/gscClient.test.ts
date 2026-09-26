import { describe, expect, it, vi, beforeEach } from "vitest";

const requestMock = vi.fn();
const getClientMock = vi.fn(async () => ({ request: requestMock }));

vi.mock("../src/auth.js", () => ({
  getAuth: () => ({ getClient: getClientMock }),
}));

describe("gscClient", () => {
  beforeEach(() => {
    requestMock.mockReset();
    requestMock.mockResolvedValue({ data: { ok: true } });
  });

  it("listSites calls the sites endpoint with GET", async () => {
    const { listSites } = await import("../src/gscClient.js");
    await listSites();
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://www.googleapis.com/webmasters/v3/sites",
        method: "GET",
      }),
    );
  });

  it("listSitemaps encodes the site URL", async () => {
    const { listSitemaps } = await import("../src/gscClient.js");
    await listSitemaps("sc-domain:example.de");
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Aexample.de/sitemaps",
        method: "GET",
      }),
    );
  });

  it("queryAnalytics posts the query body", async () => {
    const { queryAnalytics } = await import("../src/gscClient.js");
    await queryAnalytics("https://example.de/", {
      startDate: "2026-01-01",
      endDate: "2026-01-28",
      dimensions: ["query"],
      rowLimit: 50,
    });
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fexample.de%2F/searchAnalytics/query",
        method: "POST",
        data: expect.objectContaining({ startDate: "2026-01-01", rowLimit: 50 }),
      }),
    );
  });

  it("inspectUrl posts siteUrl and inspectionUrl", async () => {
    const { inspectUrl } = await import("../src/gscClient.js");
    await inspectUrl("https://example.de/", "https://example.de/blog/post");
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
        method: "POST",
        data: { siteUrl: "https://example.de/", inspectionUrl: "https://example.de/blog/post" },
      }),
    );
  });
});
