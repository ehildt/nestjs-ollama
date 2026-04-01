import type { Config } from "ollama";

export type OllamaConfigFactory = (...deps: any[]) => Promise<Config> | Config;

export type OllamaModuleProps = {
  global?: boolean;
  inject: Array<any>;
  useFactory: OllamaConfigFactory;
};
