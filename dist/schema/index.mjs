import Joi from 'joi';

// src/schema/ollama-config.schema.ts
var headersInitSchema = Joi.alternatives().try(
  Joi.array().items(Joi.array().length(2).ordered(Joi.string(), Joi.string())),
  Joi.object().pattern(Joi.string(), Joi.string()),
  Joi.custom((value) => {
    if (value instanceof Headers) return value;
    throw new Error("Expected Headers instance");
  })
);
var OllamaConfigSchema = Joi.object({
  host: Joi.string().required(),
  fetch: Joi.function().optional(),
  proxy: Joi.boolean().optional(),
  headers: headersInitSchema.optional()
}).required();

export { OllamaConfigSchema, headersInitSchema };
