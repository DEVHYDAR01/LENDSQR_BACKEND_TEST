import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const fundWalletSchema = Joi.object({
  amount: Joi.number().positive().min(100).max(5000000).required(),
});

export const transferSchema = Joi.object({
  recipient_id: Joi.string().uuid().required(),
  amount: Joi.number().positive().min(1).required(),
  description: Joi.string().max(255).optional(),
});

export const withdrawSchema = Joi.object({
  amount: Joi.number().positive().min(100).required(),
});