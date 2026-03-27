# @ehildt/nestjs-ollama

A lightweight NestJS wrapper for Ollama JS with support for all Ollama operations.

**Requirements:**
- ESM-only (does not support CommonJS)
- Your project must use ES modules

## Installation

```bash
npm install @ehildt/nestjs-ollama
```

## Peer Dependencies

```bash
npm install @nestjs/common joi ollama
```

## Quick Start

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

## Usage in Services

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

  async embed() {
    const response = await this.ollama.embed({
      model: "llama2",
      input: "Hello world",
    });
    console.log(response.embeddings);
  }
}
```

For streaming chat, see [Usage](./Usage.md).

For configuration options and types, see [Configuration](./Configuration.md).

## API Overview

| Export | Description |
|--------|-------------|
| `OllamaModule` | Dynamic NestJS module for Ollama |
| `OllamaService` | Service for all Ollama operations |
| `OllamaConfig` | Type for configuration options |
| `OllamaConfigSchema` | Joi validation schema for config |

## Related

- [Usage](./Usage.md)
- [Configuration](./Configuration.md)
- [Validation Schemas](./Validation-Schemas.md)
- [GitHub](https://github.com/ehildt/nestjs-ollama)
- [Issues](https://github.com/ehildt/nestjs-ollama/issues)
