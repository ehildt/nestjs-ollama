# Usage

This guide covers setting up the module, chat (streaming and non-streaming), and embeddings.

## Registering the Module

```typescript
// app.module.ts
import { OllamaModule } from "@ehildt/nestjs-ollama";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    OllamaModule.registerAsync({
      global: true,
      inject: [],
      useFactory: async () => ({
        host: "http://localhost:11434",
      }),
    }),
  ],
})
export class AppModule {}
```

## Using ConfigService

The `useFactory` function receives any injected dependencies - from `@nestjs/config`, environment variables, or any config library.

```typescript
OllamaModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    host: configService.get("OLLAMA_HOST"),
  }),
})
```

For production apps, you can validate config using the Joi schema:

```typescript
import { OllamaConfigSchema } from "@ehildt/nestjs-ollama/schema";
import Joi from "joi";

const config = Joi.attempt(
  { host: process.env.OLLAMA_HOST },
  OllamaConfigSchema,
);
```

See [Configuration](./Configuration.md) for the full type definition.
See [Validation Schemas](./Validation-Schemas.md) for the Joi schema.

## Chat (Non-Streaming)

```typescript
// my.service.ts
import { Injectable } from "@nestjs/common";
import { OllamaService } from "@ehildt/nestjs-ollama/service";

@Injectable()
export class MyService {
  constructor(private readonly ollama: OllamaService) {}

  async chat() {
    const response = await this.ollama.chat({
      model: "llama2",
      messages: [{ role: "user", content: "Hello!" }],
    });
    console.log(response.message.content);
  }
}
```

## Chat (Streaming)

When streaming is enabled, you must provide an `onChunk` callback to handle each streamed chunk.

```typescript
async streamChat() {
  await this.ollama.chat(
    { model: "llama2", messages: [{ role: "user", content: "Hello!" }], stream: true },
    async (chunk) => {
      process.stdout.write(chunk.message.content);
    },
  );
}
```

## Embeddings

```typescript
async embed() {
  const response = await this.ollama.embed({
    model: "llama2",
    input: "Hello world",
  });
  console.log(response.embeddings); // array of embedding vectors
}
```

## Error Handling

The service throws `OllamaEmbeddingsError` when embeddings are empty or null.

```typescript
import { OllamaService, OllamaEmbeddingsError } from "@ehildt/nestjs-ollama/service";

try {
  await this.ollama.embed({ model: "llama2", input: "" });
} catch (error) {
  if (error instanceof OllamaEmbeddingsError) {
    console.error("No embeddings returned:", error.message);
  }
}
```

## Related

- [Configuration](./Configuration.md) - Full config type definition
- [Validation Schemas](./Validation-Schemas.md) - Joi validation schema
