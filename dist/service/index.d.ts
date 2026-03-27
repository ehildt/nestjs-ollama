import * as ollama from 'ollama';
import { Ollama, ChatRequest, ChatResponse, EmbedRequest } from 'ollama';

declare class OllamaEmbeddingsError extends Error {
    constructor(message?: string, cause?: unknown);
}
declare class OllamaCollectionsError extends Error {
    constructor(message?: string, cause?: unknown);
}
declare class OllamaService {
    private readonly ollama;
    constructor(ollama: Ollama);
    chat(request: ChatRequest, onChunk?: (chunk: ChatResponse) => Promise<void> | void): Promise<ChatResponse | undefined>;
    embed(request: EmbedRequest): Promise<ollama.EmbedResponse>;
}

export { OllamaCollectionsError, OllamaEmbeddingsError, OllamaService };
