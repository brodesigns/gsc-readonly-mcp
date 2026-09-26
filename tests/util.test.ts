import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { defaultSiteUrl } from "../src/util.js";

describe("defaultSiteUrl", () => {
  const originalEnv = process.env.GSC_SITE_URL;

  beforeEach(() => {
    delete process.env.GSC_SITE_URL;
  });

  afterEach(() => {
    if (originalEnv === undefined) delete process.env.GSC_SITE_URL;
    else process.env.GSC_SITE_URL = originalEnv;
  });

  it("returns the explicit value when given", () => {
    process.env.GSC_SITE_URL = "https://env-fallback.example/";
    expect(defaultSiteUrl("https://explicit.example/")).toBe("https://explicit.example/");
  });

  it("falls back to GSC_SITE_URL when no explicit value is given", () => {
    process.env.GSC_SITE_URL = "sc-domain:example.de";
    expect(defaultSiteUrl(undefined)).toBe("sc-domain:example.de");
  });

  it("throws when neither is set", () => {
    expect(() => defaultSiteUrl(undefined)).toThrow(/GSC_SITE_URL/);
  });
});
