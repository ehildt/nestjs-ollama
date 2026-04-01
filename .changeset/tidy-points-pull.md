---
"@ehildt/nestjs-ollama": patch
---

- Allow OllamaConfigFactory to return Config directly (not only Promise<Config>)
- Remove OLLAMA_CLIENT from module exports
- Remove OllamaCollectionsError from service exports
- Update devDeps: npm-check-updates, typescript-eslint, dependency-cruiser
