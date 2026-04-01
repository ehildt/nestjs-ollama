import { DynamicModule, Module, Provider } from "@nestjs/common";

import { OLLAMA_CLIENT } from "../constants/ollama.constants.ts";
import { OllamaModuleProps } from "../models/ollama.model.ts";
import { OllamaService } from "../service/ollama.service.ts";

@Module({})
export class OllamaModule {
  static registerAsync(options: OllamaModuleProps): DynamicModule {
    const OllamaConfigProvider: Provider = {
      provide: OLLAMA_CLIENT,
      inject: options.inject,
      useFactory: options.useFactory,
    };

    return {
      global: options.global,
      module: OllamaModule,
      exports: [OllamaService],
      providers: [OllamaConfigProvider, OllamaService],
    };
  }
}
