import * as Joi from 'joi';

/**
 * Joi schema for validating environment variables.
 * Used with ConfigModule.forRoot({ validationSchema: Joi.object(validationSchema) }).
 */
export const validationSchema = {
  DATABASE_URL: Joi.string().uri().required(),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  REDIS_URL: Joi.string().uri().optional(),
  JWT_SECRET: Joi.string().min(16).optional(),
};
