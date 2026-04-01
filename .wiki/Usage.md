# Usage

This guide covers setting up the module, chat (streaming and non-streaming), embeddings, and other Ollama operations.

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
});
```

For production apps, you can validate config using the Joi schema:

```typescript
import { OllamaConfigSchema } from "@ehildt/nestjs-ollama";
import Joi from "joi";

const config = Joi.attempt(
  { host: process.env.OLLAMA_HOST },
  OllamaConfigSchema
);
```

See [Configuration](./Configuration.md) for the full type definition.
See [Validation Schemas](./Validation-Schemas.md) for the Joi schema.

## Chat (Non-Streaming)

```typescript
// my.service.ts
import { Injectable } from "@nestjs/common";
import { OllamaService } from "@ehildt/nestjs-ollama";

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

## Generate (Non-Streaming)

```typescript
async generate() {
  const response = await this.ollama.generate({
    model: "llama2",
    prompt: "Once upon a time",
  });
  console.log(response.response);
}
```

## Generate (Streaming)

```typescript
async streamGenerate() {
  await this.ollama.generate(
    { model: "llama2", prompt: "Once upon a time", stream: true },
    async (chunk) => {
      process.stdout.write(chunk.response);
    },
  );
}
```

## Pull Model

```typescript
async pullModel() {
  await this.ollama.pull({ model: "llama2" });
}
```

## Pull Model (Streaming)

```typescript
async streamPullModel() {
  await this.ollama.pull(
    { model: "llama2", stream: true },
    async (chunk) => {
      console.log(chunk.status);
    },
  );
}
```

## Push Model

```typescript
async pushModel() {
  await this.ollama.push({ model: "my-model" });
}
```

## Push Model (Streaming)

```typescript
async streamPushModel() {
  await this.ollama.push(
    { model: "my-model", stream: true },
    async (chunk) => {
      console.log(chunk.status);
    },
  );
}
```

## Create Model

```typescript
async createModel() {
  await this.ollama.create({ model: "my-model", from: "llama2" });
}
```

## Create Model (Streaming)

```typescript
async streamCreateModel() {
  await this.ollama.create(
    { model: "my-model", from: "llama2", stream: true },
    async (chunk) => {
      console.log(chunk.status);
    },
  );
}
```

## Delete Model

```typescript
async deleteModel() {
  await this.ollama.delete({ model: "llama2" });
}
```

## Copy Model

```typescript
async copyModel() {
  await this.ollama.copy({ source: "llama2", destination: "llama2-backup" });
}
```

## List Models

```typescript
async listModels() {
  const response = await this.ollama.list();
  console.log(response.models);
}
```

## Show Model Info

```typescript
async showModel() {
  const response = await this.ollama.show({ model: "llama2" });
  console.log(response.system);
}
```

## List Running Models

```typescript
async ps() {
  const response = await this.ollama.ps();
  console.log(response.models);
}
```

## Get Version

```typescript
async version() {
  const response = await this.ollama.version();
  console.log(response.version);
}
```

## Related

- [Configuration](./Configuration.md) - Full config type definition
- [Validation Schemas](./Validation-Schemas.md) - Joi validation schema
