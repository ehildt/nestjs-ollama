import { Injectable, Inject, Module } from '@nestjs/common';
import { Ollama } from 'ollama';

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);

// src/constants/ollama.constants.ts
var OLLAMA_CLIENT = /* @__PURE__ */ Symbol("OLLAMA_CLIENT");
var OllamaEmbeddingsError = class extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = this.constructor.name;
  }
};
var OllamaService = class {
  constructor(ollama) {
    this.ollama = ollama;
  }
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
  async chat(request, onChunk) {
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
  async embed(request) {
    const response = await this.ollama.embed(request);
    if (response?.embeddings?.length) return response;
    throw new OllamaEmbeddingsError(`No or empty embeddings were returned by Ollama (model: ${request.model}).`);
  }
};
OllamaService = __decorateClass([
  Injectable(),
  __decorateParam(0, Inject(OLLAMA_CLIENT))
], OllamaService);

// src/module/ollama.module.ts
var OllamaModule = class {
  static registerAsync(options) {
    return {
      global: options.global,
      module: OllamaModule,
      exports: [OLLAMA_CLIENT, OllamaService],
      providers: [
        OllamaService,
        {
          provide: OLLAMA_CLIENT,
          inject: options.inject,
          useFactory: async (...deps) => new Ollama(await options.useFactory(...deps))
        }
      ]
    };
  }
};
OllamaModule = __decorateClass([
  Module({})
], OllamaModule);

export { OllamaModule };
