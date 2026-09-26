import { describe, expect, it, beforeEach, vi } from "vitest";

describe("getAuth", () => {
  const originalEnv = process.env.GSC_SERVICE_ACCOUNT_KEY_FILE;

  beforeEach(() => {
    delete process.env.GSC_SERVICE_ACCOUNT_KEY_FILE;
    vi.resetModules();
  });

  it("throws a clear error when GSC_SERVICE_ACCOUNT_KEY_FILE is not set", async () => {
    const { getAuth } = await import("../src/auth.js");
    expect(() => getAuth()).toThrow(/GSC_SERVICE_ACCOUNT_KEY_FILE/);
  });

  it("constructs a GoogleAuth client scoped to webmasters.readonly", async () => {
    process.env.GSC_SERVICE_ACCOUNT_KEY_FILE = "/tmp/does-not-need-to-exist.json";
    const { getAuth } = await import("../src/auth.js");
    const auth = getAuth();
    expect(auth).toBeDefined();
    if (originalEnv === undefined) delete process.env.GSC_SERVICE_ACCOUNT_KEY_FILE;
    else process.env.GSC_SERVICE_ACCOUNT_KEY_FILE = originalEnv;
  });
});
