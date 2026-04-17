# @ehildt/nestjs-ollama

## 1.2.1

### Patch Changes

- 228c525: Enhanced header configuration documentation and added comprehensive test coverage

  - Added detailed examples in `.wiki/Configuration.md` for:
    - API Key authentication patterns
    - Ollama.com authentication
    - Multiple custom headers configuration
    - HeadersInit object usage
  - Added 3 new test cases in `ollama.service.spec.ts` to verify:
    - Headers object passing to Ollama client
    - Headers class usage
    - Backwards compatibility without headers

## 1.2.0

### Minor Changes

- cb3e783: Rename config injection constant and add lazy client initialization

## 1.1.0

### Minor Changes

- 8b116af: Consolidate exports into single entry point

## 1.0.1

### Patch Changes

- e3f71ff: - Allow OllamaConfigFactory to return Config directly (not only Promise<Config>)
  - Remove OLLAMA_CLIENT from module exports
  - Remove OllamaCollectionsError from service exports
  - Update devDeps: npm-check-updates, typescript-eslint, dependency-cruiser

## 1.0.0

### Major Changes

- c619fca: init commit
