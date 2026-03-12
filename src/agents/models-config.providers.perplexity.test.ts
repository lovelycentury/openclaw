import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { withEnvAsync } from "../test-utils/env.js";
import { resolveApiKeyForProvider } from "./model-auth.js";
import { resolveImplicitProvidersForTest } from "./models-config.e2e-harness.js";
import { buildPerplexityProvider } from "./models-config.providers.js";

describe("Perplexity provider", () => {
  it("should build provider with correct base url and api type", () => {
    const provider = buildPerplexityProvider();
    expect(provider.baseUrl).toBe("https://api.perplexity.ai");
    expect(provider.api).toBe("openai-completions");
  });

  it("should include all expected models", () => {
    const provider = buildPerplexityProvider();
    const ids = provider.models.map((m) => m.id);
    expect(ids).toContain("sonar");
    expect(ids).toContain("sonar-pro");
    expect(ids).toContain("sonar-reasoning-pro");
    expect(ids).toContain("sonar-deep-research");
    expect(ids).toContain("r1-1776");
    // sonar-reasoning was removed from Perplexity docs; replaced by sonar-reasoning-pro
    expect(ids).not.toContain("sonar-reasoning");
  });

  it("should mark reasoning models correctly", () => {
    const provider = buildPerplexityProvider();
    const byId = Object.fromEntries(provider.models.map((m) => [m.id, m]));
    expect(byId["sonar"]?.reasoning).toBe(false);
    expect(byId["sonar-pro"]?.reasoning).toBe(false);
    expect(byId["sonar-reasoning-pro"]?.reasoning).toBe(true);
    expect(byId["sonar-deep-research"]?.reasoning).toBe(true);
    expect(byId["r1-1776"]?.reasoning).toBe(true);
  });

  it("should include perplexity when PERPLEXITY_API_KEY is set", async () => {
    const agentDir = mkdtempSync(join(tmpdir(), "openclaw-test-"));
    await withEnvAsync({ PERPLEXITY_API_KEY: "pplx-test-key" }, async () => {
      const providers = await resolveImplicitProvidersForTest({ agentDir });
      expect(providers?.perplexity).toBeDefined();
      expect(providers?.perplexity?.models?.length).toBeGreaterThan(0);
    });
  });

  it("should not include perplexity when PERPLEXITY_API_KEY is absent", async () => {
    const agentDir = mkdtempSync(join(tmpdir(), "openclaw-test-"));
    await withEnvAsync({ PERPLEXITY_API_KEY: undefined }, async () => {
      const providers = await resolveImplicitProvidersForTest({ agentDir });
      expect(providers?.perplexity).toBeUndefined();
    });
  });

  it("resolves the perplexity api key from env", async () => {
    const agentDir = mkdtempSync(join(tmpdir(), "openclaw-test-"));
    await withEnvAsync({ PERPLEXITY_API_KEY: "pplx-real-api-key" }, async () => {
      const auth = await resolveApiKeyForProvider({ provider: "perplexity", agentDir });
      expect(auth.apiKey).toBe("pplx-real-api-key");
      expect(auth.mode).toBe("api-key");
      expect(auth.source).toContain("PERPLEXITY_API_KEY");
    });
  });
});
