"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const joi = require("joi");
exports.envSchema = joi.object({
    DB_USER: joi.string().required(),
    DB_PASS: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.string().required(),
    REDIS_HOST: joi.string().required(),
    REDIS_PORT: joi.string().required(),
});
//# sourceMappingURL=env.schema.js.map