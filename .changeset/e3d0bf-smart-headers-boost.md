---
"@ehildt/nestjs-ollama": patch
---

Enhanced header configuration documentation and added comprehensive test coverage

- Added detailed examples in `.wiki/Configuration.md` for:
  - API Key authentication patterns
  - Ollama.com authentication
  - Multiple custom headers configuration
  - HeadersInit object usage
- Added 3 new test cases in `ollama.service.spec.ts` to verify:
  - Headers object passing to Ollama client
  - Headers class usage
  - Backwards compatibility without headers