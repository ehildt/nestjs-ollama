import { Config } from 'ollama';
export { EmbedResponse } from 'ollama';

type OllamaConfigFactory = (...deps: any[]) => Promise<Config> | Config;
type OllamaModuleProps = {
    global?: boolean;
    inject: Array<any>;
    useFactory: OllamaConfigFactory;
};

export type { OllamaConfigFactory, OllamaModuleProps };
