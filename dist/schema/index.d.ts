import Joi from 'joi';

declare const headersInitSchema: Joi.AlternativesSchema<any>;
declare const OllamaConfigSchema: Joi.ObjectSchema<any>;

export { OllamaConfigSchema, headersInitSchema };
