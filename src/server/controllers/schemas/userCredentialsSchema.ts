import { Joi } from "express-validation";

export const userRegisterSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    job: Joi.string().required(),
  }),
};

export const userLoginSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(5).required(),
  }),
};
