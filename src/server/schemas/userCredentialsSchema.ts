import { Joi } from "express-validation";

export const userRegisterSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
  }),
};
