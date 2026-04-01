import { DynamicModule, Module } from "@nestjs/common";
import { Ollama } from "ollama";

import { OLLAMA_CLIENT } from "../constants/ollama.constants.ts";
import { OllamaModuleProps } from "../models/ollama.model.ts";
import { OllamaService } from "../service/ollama.service.ts";

@Module({})
export class OllamaModule {
  static registerAsync(options: OllamaModuleProps): DynamicModule {
    return {
      global: options.global,
      module: OllamaModule,
      exports: [OllamaService],
      providers: [
        OllamaService,
        {
          provide: OLLAMA_CLIENT,
          inject: options.inject,
          useFactory: async (...deps) => new Ollama(await options.useFactory(...deps)),
        },
      ],
    };
  }
}
