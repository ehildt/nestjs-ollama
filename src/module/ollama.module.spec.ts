import { Config } from "ollama";
import { describe, expect, it, vi } from "vitest";

import { NESTJS_OLLAMA_CONFIG } from "../constants/ollama.constants.ts";
import { OllamaService } from "../service/ollama.service.ts";

import { OllamaModule } from "./ollama.module.ts";

vi.mock("ollama", () => ({
  Ollama: vi.fn().mockImplementation(() => ({})),
}));

describe("OllamaModule", () => {
  describe("registerAsync", () => {
    it("should create a dynamic module", async () => {
      const mockConfig: Config = { host: "http://localhost:11434" };
      const module = OllamaModule.registerAsync({
        inject: [],
        useFactory: async () => mockConfig,
      });

      expect(module.module).toBe(OllamaModule);
      expect(module.exports).toBeDefined();
      expect(module.exports).toContain(OllamaService);
    });

    it("should set global option when provided", () => {
      const mockConfig: Config = { host: "http://localhost:11434" };
      const module = OllamaModule.registerAsync({
        inject: [],
        useFactory: async () => mockConfig,
        global: true,
      });

      expect(module.global).toBe(true);
    });

    it("should not set global when not provided", () => {
      const mockConfig: Config = { host: "http://localhost:11434" };
      const module = OllamaModule.registerAsync({
        inject: [],
        useFactory: async () => mockConfig,
      });

      expect(module.global).toBeUndefined();
    });

    it("should include OllamaService in providers", () => {
      const mockConfig: Config = { host: "http://localhost:11434" };
      const module = OllamaModule.registerAsync({
        inject: [],
        useFactory: async () => mockConfig,
      });

      expect(module.providers).toBeDefined();
      expect(module.providers).toContain(OllamaService);
    });

    it("should include OLLAMA_CLIENT in providers", () => {
      const mockConfig: Config = { host: "http://localhost:11434" };
      const module = OllamaModule.registerAsync({
        inject: [],
        useFactory: async () => mockConfig,
      });

      const ollamaProvider = module.providers?.find(
        (p) => typeof p === "object" && "provide" in p && p.provide === NESTJS_OLLAMA_CONFIG,
      );
      expect(ollamaProvider).toBeDefined();
    });

    it("should pass inject to factory", () => {
      const mockConfig: Config = { host: "http://localhost:11434" };
      const inject = ["ConfigService"];
      const module = OllamaModule.registerAsync({
        inject,
        useFactory: async () => mockConfig,
      });

      const ollamaProvider = module.providers?.find(
        (p) => typeof p === "object" && "provide" in p && p.provide === NESTJS_OLLAMA_CONFIG,
      );
      expect(ollamaProvider).toBeDefined();
      expect((ollamaProvider as { inject?: string[] }).inject).toEqual(inject);
    });
  });
});
