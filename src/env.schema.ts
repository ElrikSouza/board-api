import * as joi from 'joi';
export const envSchema = joi.object({
  DB_USER: joi.string().required(),
  DB_PASS: joi.string().required(),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.string().required(),

  REDIS_HOST: joi.string().required(),
  REDIS_PORT: joi.string().required(),
});
