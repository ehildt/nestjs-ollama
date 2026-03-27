import { Injectable, Inject } from '@nestjs/common';

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

// src/service/ollama.service.ts
var OllamaCollectionsError = class extends Error {
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
   * Send a chat request to the Ollama model.
   *
   * When `request.stream` is `true`, pass an `onChunk` callback to handle each streamed chunk.
   * @see https://github.com/ollama/ollama-js#chat
   * @see https://github.com/ehildt/nestjs-ollama/wiki/Usage#chat-streaming
   */
  async chat(request, onChunk) {
    if (!request.stream) return await this.ollama.chat({ ...request, stream: false });
    if (!onChunk) throw new Error("Streaming requires an onChunk callback");
    const stream = await this.ollama.chat({ ...request, stream: true });
    for await (const chunk of stream) await onChunk(chunk);
  }
  /**
   * Generate a response from a prompt.
   *
   * Use for single-shot text generation tasks like summarization, translation, or code completion.
   * When `request.stream` is `true`, pass an `onChunk` callback to handle each streamed chunk.
   * @see https://github.com/ollama/ollama-js#generate
   * @see https://github.com/ehildt/nestjs-ollama/wiki/Usage#generate-streaming
   */
  async generate(request, onChunk) {
    if (!request.stream) return await this.ollama.generate({ ...request, stream: false });
    if (!onChunk) throw new Error("Streaming requires an onChunk callback");
    const stream = await this.ollama.generate({ ...request, stream: true });
    for await (const chunk of stream) await onChunk(chunk);
  }
  /**
   * Computes vector embeddings for the given input.
   * @see https://github.com/ollama/ollama-js#embed
   */
  async embed(request) {
    return await this.ollama.embed(request);
  }
  /**
   * Download a model from the Ollama registry.
   *
   * When `request.stream` is `true`, pass an `onChunk` callback to handle each streamed chunk.
   * @see https://github.com/ollama/ollama-js#pull
   * @see https://github.com/ehildt/nestjs-ollama/wiki/Usage#pull-model-streaming
   */
  async pull(request, onChunk) {
    if (!request.stream) return await this.ollama.pull({ ...request, stream: false });
    if (!onChunk) throw new Error("Streaming requires an onChunk callback");
    const stream = await this.ollama.pull({ ...request, stream: true });
    for await (const chunk of stream) await onChunk(chunk);
  }
  /**
   * Upload a model to the Ollama registry.
   *
   * When `request.stream` is `true`, pass an `onChunk` callback to handle each streamed chunk.
   * @see https://github.com/ollama/ollama-js#push
   * @see https://github.com/ehildt/nestjs-ollama/wiki/Usage#push-model-streaming
   */
  async push(request, onChunk) {
    if (!request.stream) return await this.ollama.push({ ...request, stream: false });
    if (!onChunk) throw new Error("Streaming requires an onChunk callback");
    const stream = await this.ollama.push({ ...request, stream: true });
    for await (const chunk of stream) await onChunk(chunk);
  }
  /**
   * Create a model from a base model.
   *
   * When `request.stream` is `true`, pass an `onChunk` callback to handle each streamed chunk.
   * @see https://github.com/ollama/ollama-js#create
   * @see https://github.com/ehildt/nestjs-ollama/wiki/Usage#create-model-streaming
   */
  async create(request, onChunk) {
    if (!request.stream) return await this.ollama.create({ ...request, stream: false });
    if (!onChunk) throw new Error("Streaming requires an onChunk callback");
    const stream = await this.ollama.create({ ...request, stream: true });
    for await (const chunk of stream) await onChunk(chunk);
  }
  /**
   * Delete a model from local storage.
   * @see https://github.com/ollama/ollama-js#delete
   */
  async delete(request) {
    return await this.ollama.delete(request);
  }
  /**
   * Copy a model to a new name.
   * @see https://github.com/ollama/ollama-js#copy
   */
  async copy(request) {
    return await this.ollama.copy(request);
  }
  /**
   * List all available models.
   * @see https://github.com/ollama/ollama-js#list
   */
  async list() {
    return await this.ollama.list();
  }
  /**
   * Show model information (system prompt, template, etc.).
   * @see https://github.com/ollama/ollama-js#show
   */
  async show(request) {
    return await this.ollama.show(request);
  }
  /**
   * List currently running models.
   * @see https://github.com/ollama/ollama-js#ps
   */
  async ps() {
    return await this.ollama.ps();
  }
  /**
   * Get the Ollama server version.
   * @see https://github.com/ollama/ollama-js#version
   */
  async version() {
    return await this.ollama.version();
  }
};
OllamaService = __decorateClass([
  Injectable(),
  __decorateParam(0, Inject(OLLAMA_CLIENT))
], OllamaService);

export { OllamaCollectionsError, OllamaService };
