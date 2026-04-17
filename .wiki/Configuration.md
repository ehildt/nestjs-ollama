# Configuration

This document describes the configuration options for the Ollama module.

## OllamaConfig Type

The configuration type is exported from the `ollama` package. Here's the full type definition:

```typescript
interface Config {
  host: string;
  fetch?: typeof fetch;
  proxy?: boolean;
  headers?: HeadersInit;
}
```

| Property  | Type           | Required | Description                                            |
| --------- | -------------- | -------- | ------------------------------------------------------ |
| `host`    | `string`       | Yes      | The Ollama server URL (e.g., `http://localhost:11434`) |
| `fetch`   | `typeof fetch` | No       | Custom fetch implementation                            |
| `proxy`   | `boolean`      | No       | Enable proxy support                                   |
| `headers` | `HeadersInit`  | No       | Additional headers to send with requests               |

## Basic Example

```typescript
import { OllamaModule } from "@ehildt/nestjs-ollama";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    OllamaModule.registerAsync({
      useFactory: async () => ({
        host: "http://localhost:11434",
      }),
    }),
  ],
})
export class AppModule {}
```

## With Custom Headers

```typescript
OllamaModule.registerAsync({
  useFactory: async () => ({
    host: "http://localhost:11434",
    headers: {
      Authorization: "Bearer token",
    },
  }),
});
```

### API Key Authentication

```typescript
OllamaModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    host: configService.get("OLLAMA_HOST"),
    headers: {
      Authorization: `Bearer ${configService.get("OLLAMA_API_KEY")}`,
    },
  }),
});
```

### Ollama.com Authentication

When connecting to ollama.com, the library automatically adds the `Authorization` header from the `OLLAMA_API_KEY` environment variable. You can also manually configure it:

```typescript
OllamaModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    host: "https://ollama.com",
    headers: {
      Authorization: `Bearer ${configService.get("OLLAMA_API_KEY")}`,
    },
  }),
});
```

### Multiple Custom Headers

```typescript
OllamaModule.registerAsync({
  useFactory: async () => ({
    host: "http://localhost:11434",
    headers: {
      Authorization: "Bearer token",
      "X-Request-ID": "uuid-1234",
      "X-Custom-Header": "custom-value",
      "X-Client-Version": "1.0.0",
    },
  }),
});
```

### Headers with HeadersInit Object

You can also use a Headers object:

```typescript
OllamaModule.registerAsync({
  useFactory: async () => {
    const headers = new Headers();
    headers.append("Authorization", "Bearer token");
    headers.append("X-Custom-Header", "custom-value");

    return {
      host: "http://localhost:11434",
      headers,
    };
  },
});
```

## Using Environment Variables

```typescript
import { ConfigService } from "@nestjs/config";
import { OllamaModule } from "@ehildt/nestjs-ollama";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    OllamaModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        host: configService.get("OLLAMA_HOST"),
      }),
    }),
  ],
})
export class AppModule {}
```

## With Joi Validation

```typescript
import { OllamaConfigSchema } from "@ehildt/nestjs-ollama";
import Joi from "joi";

const config = Joi.attempt(
  { host: process.env.OLLAMA_HOST },
  OllamaConfigSchema
);

OllamaModule.registerAsync({
  useFactory: async () => config,
});
```

See [Validation Schemas](./Validation-Schemas.md) for more details on the Joi schema.
