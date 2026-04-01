import { DynamicModule, Module, Provider } from "@nestjs/common";

import { NESTJS_OLLAMA_CONFIG } from "../constants/ollama.constants.ts";
import { OllamaModuleProps } from "../models/ollama.model.ts";
import { OllamaService } from "../service/ollama.service.ts";

@Module({})
export class OllamaModule {
  static registerAsync(options: OllamaModuleProps): DynamicModule {
    const OllamaConfigProvider: Provider = {
      provide: NESTJS_OLLAMA_CONFIG,
      inject: options.inject,
      useFactory: options.useFactory,
    };

    return {
      module: OllamaModule,
      global: options.global,
      exports: [OllamaService],
      providers: [OllamaConfigProvider, OllamaService],
    };
  }
}
