import { Inject, Injectable } from "@nestjs/common";
import { ChatRequest, ChatResponse, EmbedRequest, Ollama } from "ollama";

import { OLLAMA_CLIENT } from "../constants/ollama.constants.ts";

export class OllamaEmbeddingsError extends Error {
  constructor(message?: string, cause?: unknown) {
    super(message, { cause });
    this.name = this.constructor.name;
  }
}

export class OllamaCollectionsError extends Error {
  constructor(message?: string, cause?: unknown) {
    super(message, { cause });
    this.name = this.constructor.name;
  }
}

@Injectable()
export class OllamaService {
  constructor(@Inject(OLLAMA_CLIENT) private readonly ollama: Ollama) {}

  /**
   * Sends a chat request to the Ollama model.
   *
   * If `request.stream` is `true`, this method returns an async iterator that streams the chat chunks.\
   * The provided `onChunk` callback will be invoked for each streamed message chunk.\
   * If `request.stream` is `false` or not set, the method returns the full chat response in a single object.
   *
   * @param request The chat request containing the model and messages. \
   * Must include `stream: true` for streaming behavior.
   * @param onChunk Optional callback to handle each streamed chunk. \
   * This is required if `request.stream` is set to `true`.
   * @returns A promise resolving to the chat response if streaming is disabled, or `void` if streaming is enabled and `onChunk` is used.
   * @throws {Error} If `request.stream` is `true` and `onChunk` is not provided. \
   * The error message will indicate that a callback is required for streaming.
   */
  async chat(request: ChatRequest, onChunk?: (chunk: ChatResponse) => Promise<void> | void) {
    if (!request.stream) return await this.ollama.chat({ ...request, stream: false });
    if (!onChunk) throw new Error("Streaming requires an onChunk callback");
    const stream = await this.ollama.chat({ ...request, stream: true });
    for await (const chunk of stream) await onChunk(chunk);
  }

  /**
   * Computes vector embeddings for the given input using the specified model.
   *
   * @param request The embeddings request, including model name and input text.
   * @returns A promise resolving to the embeddings result.
   */
  async embed(request: EmbedRequest) {
    const response = await this.ollama.embed(request);
    if (response?.embeddings?.length) return response;
    throw new OllamaEmbeddingsError(`No or empty embeddings were returned by Ollama (model: ${request.model}).`);
  }
}
