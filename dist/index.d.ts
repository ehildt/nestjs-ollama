import * as ollama from 'ollama';
import { Config, Ollama, ChatRequest, ChatResponse, GenerateRequest, GenerateResponse, EmbedRequest, PullRequest, ProgressResponse, PushRequest, CreateRequest, StatusResponse, ListResponse, ShowRequest, ShowResponse, VersionResponse } from 'ollama';
import { DynamicModule, OnModuleInit } from '@nestjs/common';
import Joi from 'joi';

declare const NESTJS_OLLAMA_CONFIG: unique symbol;

type OllamaConfigFactory = (...deps: any[]) => Promise<Config> | Config;
type OllamaModuleProps = {
    global?: boolean;
    inject: Array<any>;
    useFactory: OllamaConfigFactory;
};

declare class OllamaModule {
    static registerAsync(options: OllamaModuleProps): DynamicModule;
}

declare const headersInitSchema: Joi.AlternativesSchema<any>;
declare const OllamaConfigSchema: Joi.ObjectSchema<any>;

declare class OllamaService implements OnModuleInit {
    private readonly config;
    private client;
    constructor(config: Config);
    onModuleInit(): void;
    get ollama(): Ollama | null;
    /**
     * Send a chat request to the Ollama model.
     *
     * When `request.stream` is `true`, pass an `onChunk` callback to handle each streamed chunk.
     * @see https://github.com/ollama/ollama-js#chat
     * @see https://github.com/ehildt/nestjs-ollama/wiki/Usage#chat-streaming
     */
    chat(request: ChatRequest, onChunk?: (chunk: ChatResponse) => Promise<void> | void): Promise<ChatResponse | undefined>;
    /**
     * Generate a response from a prompt.
     *
     * Use for single-shot text generation tasks like summarization, translation, or code completion.
     * When `request.stream` is `true`, pass an `onChunk` callback to handle each streamed chunk.
     * @see https://github.com/ollama/ollama-js#generate
     * @see https://github.com/ehildt/nestjs-ollama/wiki/Usage#generate-streaming
     */
    generate(request: GenerateRequest, onChunk?: (chunk: GenerateResponse) => Promise<void> | void): Promise<GenerateResponse | undefined>;
    /**
     * Computes vector embeddings for the given input.
     * @see https://github.com/ollama/ollama-js#embed
     */
    embed(request: EmbedRequest): Promise<ollama.EmbedResponse>;
    /**
     * Download a model from the Ollama registry.
     *
     * When `request.stream` is `true`, pass an `onChunk` callback to handle each streamed chunk.
     * @see https://github.com/ollama/ollama-js#pull
     * @see https://github.com/ehildt/nestjs-ollama/wiki/Usage#pull-model-streaming
     */
    pull(request: PullRequest, onChunk?: (chunk: ProgressResponse) => Promise<void> | void): Promise<ProgressResponse | undefined>;
    /**
     * Upload a model to the Ollama registry.
     *
     * When `request.stream` is `true`, pass an `onChunk` callback to handle each streamed chunk.
     * @see https://github.com/ollama/ollama-js#push
     * @see https://github.com/ehildt/nestjs-ollama/wiki/Usage#push-model-streaming
     */
    push(request: PushRequest, onChunk?: (chunk: ProgressResponse) => Promise<void> | void): Promise<ProgressResponse | undefined>;
    /**
     * Create a model from a base model.
     *
     * When `request.stream` is `true`, pass an `onChunk` callback to handle each streamed chunk.
     * @see https://github.com/ollama/ollama-js#create
     * @see https://github.com/ehildt/nestjs-ollama/wiki/Usage#create-model-streaming
     */
    create(request: CreateRequest, onChunk?: (chunk: ProgressResponse) => Promise<void> | void): Promise<ProgressResponse | undefined>;
    /**
     * Delete a model from local storage.
     * @see https://github.com/ollama/ollama-js#delete
     */
    delete(request: {
        model: string;
    }): Promise<StatusResponse>;
    /**
     * Copy a model to a new name.
     * @see https://github.com/ollama/ollama-js#copy
     */
    copy(request: {
        source: string;
        destination: string;
    }): Promise<StatusResponse>;
    /**
     * List all available models.
     * @see https://github.com/ollama/ollama-js#list
     */
    list(): Promise<ListResponse>;
    /**
     * Show model information (system prompt, template, etc.).
     * @see https://github.com/ollama/ollama-js#show
     */
    show(request: ShowRequest): Promise<ShowResponse>;
    /**
     * List currently running models.
     * @see https://github.com/ollama/ollama-js#ps
     */
    ps(): Promise<ListResponse>;
    /**
     * Get the Ollama server version.
     * @see https://github.com/ollama/ollama-js#version
     */
    version(): Promise<VersionResponse>;
}

export { NESTJS_OLLAMA_CONFIG, type OllamaConfigFactory, OllamaConfigSchema, OllamaModule, type OllamaModuleProps, OllamaService, headersInitSchema };
