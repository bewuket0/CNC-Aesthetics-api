import Joi from "joi";

const passwordValidation = Joi.string()
  .min(8)
  .max(30)
  .pattern(new RegExp("(?=.*[a-z])"))
  .pattern(new RegExp("(?=.*[A-Z])"))
  .pattern(new RegExp("(?=.*[0-9])"))
  .pattern(new RegExp("(?=.*[!@#$%^&*])"))
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password cannot exceed 30 characters",
    "string.pattern.base":
      "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character",
  });

const phoneNumberValidation = Joi.string()
  .pattern(/^\+251\d{9}$/)
  .message("Phone number must start with +251 and be followed by 9 digits")
  .required();

export const registerUserSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  gender: Joi.string().valid("male", "female").required(),
  email: Joi.string().email().required(),
  phone_number: phoneNumberValidation,
  password: passwordValidation,
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordValidation,
});
