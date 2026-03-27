import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OLLAMA_CLIENT } from "../constants/ollama.constants.ts";

import { OllamaEmbeddingsError, OllamaService } from "./ollama.service.ts";

describe("OllamaService", () => {
  let service: OllamaService;
  let mockOllama: {
    chat: ReturnType<typeof vi.fn>;
    embed: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockOllama = {
      chat: vi.fn(),
      embed: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OllamaService,
        {
          provide: OLLAMA_CLIENT,
          useValue: mockOllama,
        },
      ],
    }).compile();

    service = module.get<OllamaService>(OllamaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("chat", () => {
    it("should call ollama.chat with stream: false when stream is not set", async () => {
      const mockRequest = { model: "llama2", messages: [{ role: "user", content: "hello" }] };
      const mockResponse = { message: { role: "assistant", content: "hi" } };
      mockOllama.chat.mockResolvedValue(mockResponse);

      const result = await service.chat(mockRequest);

      expect(mockOllama.chat).toHaveBeenCalledWith({ ...mockRequest, stream: false });
      expect(result).toEqual(mockResponse);
    });

    it("should call ollama.chat with stream: false when stream is explicitly false", async () => {
      const mockRequest = { model: "llama2", messages: [], stream: false };
      const mockResponse = { message: { role: "assistant", content: "hi" } };
      mockOllama.chat.mockResolvedValue(mockResponse);

      const result = await service.chat(mockRequest);

      expect(mockOllama.chat).toHaveBeenCalledWith({ ...mockRequest, stream: false });
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when stream is true but no onChunk provided", async () => {
      const mockRequest = { model: "llama2", messages: [], stream: true };

      await expect(service.chat(mockRequest)).rejects.toThrow("Streaming requires an onChunk callback");
    });

    it("should stream chunks when stream is true and onChunk is provided", async () => {
      const mockRequest = { model: "llama2", messages: [], stream: true };
      const chunks = [
        { message: { role: "assistant", content: "Hello" } },
        { message: { role: "assistant", content: " World" } },
      ];
      const onChunk = vi.fn();

      mockOllama.chat.mockResolvedValue({
        [Symbol.asyncIterator]: async function* () {
          for (const chunk of chunks) {
            yield chunk;
          }
        },
      });

      await service.chat(mockRequest, onChunk);

      expect(onChunk).toHaveBeenCalledTimes(2);
      expect(onChunk).toHaveBeenNthCalledWith(1, chunks[0]);
      expect(onChunk).toHaveBeenNthCalledWith(2, chunks[1]);
    });
  });

  describe("embed", () => {
    it("should call ollama.embed and return response when embeddings are present", async () => {
      const mockRequest = { model: "llama2", input: "hello world" };
      const mockResponse = { embeddings: [[0.1, 0.2, 0.3]] };
      mockOllama.embed.mockResolvedValue(mockResponse);

      const result = await service.embed(mockRequest);

      expect(mockOllama.embed).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it("should throw OllamaEmbeddingsError when embeddings are empty", async () => {
      const mockRequest = { model: "llama2", input: "hello world" };
      mockOllama.embed.mockResolvedValue({ embeddings: [] });

      await expect(service.embed(mockRequest)).rejects.toThrow(OllamaEmbeddingsError);
      expect(mockOllama.embed).toHaveBeenCalledWith(mockRequest);
    });

    it("should throw OllamaEmbeddingsError when response is null", async () => {
      const mockRequest = { model: "llama2", input: "hello world" };
      mockOllama.embed.mockResolvedValue(null);

      await expect(service.embed(mockRequest)).rejects.toThrow(OllamaEmbeddingsError);
    });

    it("should throw OllamaEmbeddingsError when embeddings are undefined", async () => {
      const mockRequest = { model: "llama2", input: "hello world" };
      mockOllama.embed.mockResolvedValue({} as never);

      await expect(service.embed(mockRequest)).rejects.toThrow(OllamaEmbeddingsError);
    });
  });
});
