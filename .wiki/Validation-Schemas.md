# Validation Schemas

This document describes the Joi validation schemas provided by this library.

## OllamaConfigSchema

Validates the configuration object passed to the Ollama client.

```typescript
import { OllamaConfigSchema } from "@ehildt/nestjs-ollama/schema";
import Joi from "joi";

const result = Joi.object({
  host: Joi.string().required(),
  fetch: Joi.function().optional(),
  proxy: Joi.boolean().optional(),
  headers: Joi.alternatives().try(
    Joi.array().items(Joi.array().length(2).ordered(Joi.string(), Joi.string())),
    Joi.object().pattern(Joi.string(), Joi.string()),
    Joi.custom((value) => {
      if (value instanceof Headers) return value;
      throw new Error("Expected Headers instance");
    }),
  ).optional(),
}).required();
```

## Usage

### Basic Validation

```typescript
import { OllamaConfigSchema } from "@ehildt/nestjs-ollama/schema";
import Joi from "joi";

const config = {
  host: "http://localhost:11434",
};

const validated = Joi.attempt(config, OllamaConfigSchema);
```

### With Environment Variables

```typescript
import { OllamaConfigSchema } from "@ehildt/nestjs-ollama/schema";
import Joi from "joi";

const config = Joi.attempt(
  {
    host: process.env.OLLAMA_HOST,
  },
  OllamaConfigSchema,
);
```

### Error Handling

```typescript
import { OllamaConfigSchema } from "@ehildt/nestjs-ollama/schema";
import Joi from "joi";

try {
  const config = Joi.attempt(
    { host: "invalid-url" },
    OllamaConfigSchema,
  );
} catch (error) {
  if (error instanceof Joi.ValidationError) {
    console.error(error.details);
  }
}
```

## Integration with NestJS Config

```typescript
// ollama.config.ts
import { OllamaConfigSchema } from "@ehildt/nestjs-ollama/schema";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Joi from "joi";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        OLLAMA_HOST: Joi.string().required(),
      }),
    }),
  ],
})
export class OllamaConfigModule {
  static forRoot() {
    return {
      module: OllamaConfigModule,
      imports: [
        ConfigModule.forFeature(() => {
          const configService = new ConfigService();
          return Joi.attempt(
            { host: configService.get("OLLAMA_HOST") },
            OllamaConfigSchema,
          );
        }),
      ],
    };
  }
}
```
