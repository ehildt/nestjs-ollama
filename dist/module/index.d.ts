import { DynamicModule } from '@nestjs/common';
import { OllamaModuleProps } from '../models/index.js';
import 'ollama';

declare class OllamaModule {
    static registerAsync(options: OllamaModuleProps): DynamicModule;
}

export { OllamaModule };
