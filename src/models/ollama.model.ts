import { Config } from "ollama";

export type OllamaConfigFactory = (...deps: any[]) => Promise<Config>;

export type OllamaModuleProps = {
  global?: boolean;
  inject: Array<any>;
  useFactory: OllamaConfigFactory;
};

export type { EmbedResponse } from "ollama";
