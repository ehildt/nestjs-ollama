import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OLLAMA_CLIENT } from "../constants/ollama.constants.ts";

import { OllamaService } from "./ollama.service.ts";

describe("OllamaService", () => {
  let service: OllamaService;
  let mockOllama: {
    chat: ReturnType<typeof vi.fn>;
    embed: ReturnType<typeof vi.fn>;
    generate: ReturnType<typeof vi.fn>;
    pull: ReturnType<typeof vi.fn>;
    push: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    copy: ReturnType<typeof vi.fn>;
    list: ReturnType<typeof vi.fn>;
    show: ReturnType<typeof vi.fn>;
    ps: ReturnType<typeof vi.fn>;
    version: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockOllama = {
      chat: vi.fn(),
      embed: vi.fn(),
      generate: vi.fn(),
      pull: vi.fn(),
      push: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      copy: vi.fn(),
      list: vi.fn(),
      show: vi.fn(),
      ps: vi.fn(),
      version: vi.fn(),
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
    it("should call ollama.embed", async () => {
      const mockRequest = { model: "llama2", input: "hello world" };
      const mockResponse = { embeddings: [[0.1, 0.2, 0.3]] };
      mockOllama.embed.mockResolvedValue(mockResponse);

      const result = await service.embed(mockRequest);

      expect(mockOllama.embed).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("generate", () => {
    it("should call ollama.generate with stream: false when stream is not set", async () => {
      const mockRequest = { model: "llama2", prompt: "hello" };
      const mockResponse = { response: "hi" };
      mockOllama.generate.mockResolvedValue(mockResponse);

      const result = await service.generate(mockRequest);

      expect(mockOllama.generate).toHaveBeenCalledWith({ ...mockRequest, stream: false });
      expect(result).toEqual(mockResponse);
    });

    it("should call ollama.generate with stream: false when stream is explicitly false", async () => {
      const mockRequest = { model: "llama2", prompt: "hello", stream: false };
      const mockResponse = { response: "hi" };
      mockOllama.generate.mockResolvedValue(mockResponse);

      const result = await service.generate(mockRequest);

      expect(mockOllama.generate).toHaveBeenCalledWith({ ...mockRequest, stream: false });
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when stream is true but no onChunk provided", async () => {
      const mockRequest = { model: "llama2", prompt: "hello", stream: true };

      await expect(service.generate(mockRequest)).rejects.toThrow("Streaming requires an onChunk callback");
    });

    it("should stream chunks when stream is true and onChunk is provided", async () => {
      const mockRequest = { model: "llama2", prompt: "hello", stream: true };
      const chunks = [{ response: "Hello" }, { response: " World" }];
      const onChunk = vi.fn();

      mockOllama.generate.mockResolvedValue({
        [Symbol.asyncIterator]: async function* () {
          for (const chunk of chunks) {
            yield chunk;
          }
        },
      });

      await service.generate(mockRequest, onChunk);

      expect(onChunk).toHaveBeenCalledTimes(2);
      expect(onChunk).toHaveBeenNthCalledWith(1, chunks[0]);
      expect(onChunk).toHaveBeenNthCalledWith(2, chunks[1]);
    });
  });

  describe("pull", () => {
    it("should call ollama.pull with stream: false when stream is not set", async () => {
      const mockRequest = { model: "llama2" };
      const mockResponse = { status: "success" };
      mockOllama.pull.mockResolvedValue(mockResponse);

      const result = await service.pull(mockRequest);

      expect(mockOllama.pull).toHaveBeenCalledWith({ ...mockRequest, stream: false });
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when stream is true but no onChunk provided", async () => {
      const mockRequest = { model: "llama2", stream: true };

      await expect(service.pull(mockRequest)).rejects.toThrow("Streaming requires an onChunk callback");
    });

    it("should stream chunks when stream is true and onChunk is provided", async () => {
      const mockRequest = { model: "llama2", stream: true };
      const chunks = [{ status: "downloading" }, { status: "success" }];
      const onChunk = vi.fn();

      mockOllama.pull.mockResolvedValue({
        [Symbol.asyncIterator]: async function* () {
          for (const chunk of chunks) {
            yield chunk;
          }
        },
      });

      await service.pull(mockRequest, onChunk);

      expect(onChunk).toHaveBeenCalledTimes(2);
      expect(onChunk).toHaveBeenNthCalledWith(1, chunks[0]);
      expect(onChunk).toHaveBeenNthCalledWith(2, chunks[1]);
    });
  });

  describe("push", () => {
    it("should call ollama.push with stream: false when stream is not set", async () => {
      const mockRequest = { model: "llama2" };
      const mockResponse = { status: "success" };
      mockOllama.push.mockResolvedValue(mockResponse);

      const result = await service.push(mockRequest);

      expect(mockOllama.push).toHaveBeenCalledWith({ ...mockRequest, stream: false });
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when stream is true but no onChunk provided", async () => {
      const mockRequest = { model: "llama2", stream: true };

      await expect(service.push(mockRequest)).rejects.toThrow("Streaming requires an onChunk callback");
    });

    it("should stream chunks when stream is true and onChunk is provided", async () => {
      const mockRequest = { model: "llama2", stream: true };
      const chunks = [{ status: "uploading" }, { status: "success" }];
      const onChunk = vi.fn();

      mockOllama.push.mockResolvedValue({
        [Symbol.asyncIterator]: async function* () {
          for (const chunk of chunks) {
            yield chunk;
          }
        },
      });

      await service.push(mockRequest, onChunk);

      expect(onChunk).toHaveBeenCalledTimes(2);
      expect(onChunk).toHaveBeenNthCalledWith(1, chunks[0]);
      expect(onChunk).toHaveBeenNthCalledWith(2, chunks[1]);
    });
  });

  describe("create", () => {
    it("should call ollama.create with stream: false when stream is not set", async () => {
      const mockRequest = { model: "my-model", from: "llama2" };
      const mockResponse = { status: "success" };
      mockOllama.create.mockResolvedValue(mockResponse);

      const result = await service.create(mockRequest);

      expect(mockOllama.create).toHaveBeenCalledWith({ ...mockRequest, stream: false });
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when stream is true but no onChunk provided", async () => {
      const mockRequest = { model: "my-model", from: "llama2", stream: true };

      await expect(service.create(mockRequest)).rejects.toThrow("Streaming requires an onChunk callback");
    });

    it("should stream chunks when stream is true and onChunk is provided", async () => {
      const mockRequest = { model: "my-model", from: "llama2", stream: true };
      const chunks = [{ status: "creating" }, { status: "success" }];
      const onChunk = vi.fn();

      mockOllama.create.mockResolvedValue({
        [Symbol.asyncIterator]: async function* () {
          for (const chunk of chunks) {
            yield chunk;
          }
        },
      });

      await service.create(mockRequest, onChunk);

      expect(onChunk).toHaveBeenCalledTimes(2);
      expect(onChunk).toHaveBeenNthCalledWith(1, chunks[0]);
      expect(onChunk).toHaveBeenNthCalledWith(2, chunks[1]);
    });
  });

  describe("delete", () => {
    it("should call ollama.delete", async () => {
      const mockRequest = { model: "llama2" };
      const mockResponse = { status: "success" };
      mockOllama.delete.mockResolvedValue(mockResponse);

      const result = await service.delete(mockRequest);

      expect(mockOllama.delete).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("copy", () => {
    it("should call ollama.copy", async () => {
      const mockRequest = { source: "llama2", destination: "llama2-copy" };
      const mockResponse = { status: "success" };
      mockOllama.copy.mockResolvedValue(mockResponse);

      const result = await service.copy(mockRequest);

      expect(mockOllama.copy).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("list", () => {
    it("should call ollama.list", async () => {
      const mockResponse = { models: [] };
      mockOllama.list.mockResolvedValue(mockResponse);

      const result = await service.list();

      expect(mockOllama.list).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe("show", () => {
    it("should call ollama.show", async () => {
      const mockRequest = { model: "llama2" };
      const mockResponse = { model: "llama2", system: "You are a helpful assistant" };
      mockOllama.show.mockResolvedValue(mockResponse);

      const result = await service.show(mockRequest);

      expect(mockOllama.show).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("ps", () => {
    it("should call ollama.ps", async () => {
      const mockResponse = { models: [] };
      mockOllama.ps.mockResolvedValue(mockResponse);

      const result = await service.ps();

      expect(mockOllama.ps).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe("version", () => {
    it("should call ollama.version", async () => {
      const mockResponse = { version: "0.1.0" };
      mockOllama.version.mockResolvedValue(mockResponse);

      const result = await service.version();

      expect(mockOllama.version).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });
});
