import express from "express";
import { validate } from "express-validation";
import { registerUser } from "../contollers/userControllers.js";
import { userRegisterSchema } from "../schemas/userCredentialsSchema.js";

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post(
  "/login",
  validate(userRegisterSchema, {}, { abortEarly: false }),
  loginUser
);

export default userRouter;
