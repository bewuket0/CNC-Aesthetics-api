import dotenv from "dotenv";
dotenv.config();

import Joi from "joi";

const envSchema = Joi.object({
  APP_PORT: Joi.number().required().default(3000),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRY: Joi.string().required(),
  SESSION_TIMEOUT: Joi.string().required(),
  PWDSecretKey: Joi.string().required(),
  MONGODB_URL: Joi.string().required(),
}).unknown();

const { value: envVars, error } = envSchema.validate(process.env, {
  abortEarly: false, // Show all errors at once
  allowUnknown: true, // Allow extra fields
  stripUnknown: true, // Remove unknown fields
});

if (error) {
  throw new Error(`Environment variable validation error: ${error.message}`);
}

// Use the validated environment variables
const initConfig = {
  _port: envVars.APP_PORT,
  _jwtsecret: envVars.JWT_SECRET,
  _jwtexpiry: envVars.JWT_EXPIRY,
  _sessiontimeout: envVars.SESSION_TIMEOUT,
  _pwdsecretkey: envVars.PWDSecretKey,
  _mongodburl: envVars.MONGODB_URL,
};

export default initConfig;
