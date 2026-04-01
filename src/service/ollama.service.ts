import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import {
  ChatRequest,
  ChatResponse,
  Config,
  CreateRequest,
  EmbedRequest,
  GenerateRequest,
  GenerateResponse,
  ListResponse,
  Ollama,
  ProgressResponse,
  PullRequest,
  PushRequest,
  ShowRequest,
  ShowResponse,
  StatusResponse,
  VersionResponse,
} from "ollama";

import { NESTJS_OLLAMA_CONFIG } from "../constants/ollama.constants.ts";

@Injectable()
export class OllamaService implements OnModuleInit {
  private client: Ollama | null = null;
  constructor(@Inject(NESTJS_OLLAMA_CONFIG) private readonly config: Config) {}

  onModuleInit() {
    this.client = new Ollama(this.config);
  }

  get ollama() {
    return this.client;
  }

  /**
   * Send a chat request to the Ollama model.
   *
   * When `request.stream` is `true`, pass an `onChunk` callback to handle each streamed chunk.
   * @see https://github.com/ollama/ollama-js#chat
   * @see https://github.com/ehildt/nestjs-ollama/wiki/Usage#chat-streaming
   */
  async chat(request: ChatRequest, onChunk?: (chunk: ChatResponse) => Promise<void> | void) {
    if (!request.stream) return await this.client!.chat({ ...request, stream: false });
    if (!onChunk) throw new Error("Streaming requires an onChunk callback");
    const stream = await this.client!.chat({ ...request, stream: true });
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
  async generate(request: GenerateRequest, onChunk?: (chunk: GenerateResponse) => Promise<void> | void) {
    if (!request.stream) return await this.client!.generate({ ...request, stream: false });
    if (!onChunk) throw new Error("Streaming requires an onChunk callback");
    const stream = await this.client!.generate({ ...request, stream: true });
    for await (const chunk of stream) await onChunk(chunk);
  }

  /**
   * Computes vector embeddings for the given input.
   * @see https://github.com/ollama/ollama-js#embed
   */
  async embed(request: EmbedRequest) {
    return await this.client!.embed(request);
  }

  /**
   * Download a model from the Ollama registry.
   *
   * When `request.stream` is `true`, pass an `onChunk` callback to handle each streamed chunk.
   * @see https://github.com/ollama/ollama-js#pull
   * @see https://github.com/ehildt/nestjs-ollama/wiki/Usage#pull-model-streaming
   */
  async pull(request: PullRequest, onChunk?: (chunk: ProgressResponse) => Promise<void> | void) {
    if (!request.stream) return await this.client!.pull({ ...request, stream: false });
    if (!onChunk) throw new Error("Streaming requires an onChunk callback");
    const stream = await this.client!.pull({ ...request, stream: true });
    for await (const chunk of stream) await onChunk(chunk);
  }

  /**
   * Upload a model to the Ollama registry.
   *
   * When `request.stream` is `true`, pass an `onChunk` callback to handle each streamed chunk.
   * @see https://github.com/ollama/ollama-js#push
   * @see https://github.com/ehildt/nestjs-ollama/wiki/Usage#push-model-streaming
   */
  async push(request: PushRequest, onChunk?: (chunk: ProgressResponse) => Promise<void> | void) {
    if (!request.stream) return await this.client!.push({ ...request, stream: false });
    if (!onChunk) throw new Error("Streaming requires an onChunk callback");
    const stream = await this.client!.push({ ...request, stream: true });
    for await (const chunk of stream) await onChunk(chunk);
  }

  /**
   * Create a model from a base model.
   *
   * When `request.stream` is `true`, pass an `onChunk` callback to handle each streamed chunk.
   * @see https://github.com/ollama/ollama-js#create
   * @see https://github.com/ehildt/nestjs-ollama/wiki/Usage#create-model-streaming
   */
  async create(request: CreateRequest, onChunk?: (chunk: ProgressResponse) => Promise<void> | void) {
    if (!request.stream) return await this.client!.create({ ...request, stream: false });
    if (!onChunk) throw new Error("Streaming requires an onChunk callback");
    const stream = await this.client!.create({ ...request, stream: true });
    for await (const chunk of stream) await onChunk(chunk);
  }

  /**
   * Delete a model from local storage.
   * @see https://github.com/ollama/ollama-js#delete
   */
  async delete(request: { model: string }): Promise<StatusResponse> {
    return await this.client!.delete(request);
  }

  /**
   * Copy a model to a new name.
   * @see https://github.com/ollama/ollama-js#copy
   */
  async copy(request: { source: string; destination: string }): Promise<StatusResponse> {
    return await this.client!.copy(request);
  }

  /**
   * List all available models.
   * @see https://github.com/ollama/ollama-js#list
   */
  async list(): Promise<ListResponse> {
    return await this.client!.list();
  }

  /**
   * Show model information (system prompt, template, etc.).
   * @see https://github.com/ollama/ollama-js#show
   */
  async show(request: ShowRequest): Promise<ShowResponse> {
    return await this.client!.show(request);
  }

  /**
   * List currently running models.
   * @see https://github.com/ollama/ollama-js#ps
   */
  async ps(): Promise<ListResponse> {
    return await this.client!.ps();
  }

  /**
   * Get the Ollama server version.
   * @see https://github.com/ollama/ollama-js#version
   */
  async version(): Promise<VersionResponse> {
    return await this.client!.version();
  }
}
