import express from "express";
import { validate } from "express-validation";
import {
  getAllUsers,
  loginUser,
  registerUser,
} from "../controllers/userControllers.js";
import {
  userLoginSchema,
  userRegisterSchema,
} from "../schemas/userCredentialsSchema.js";

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post(
  "/register",
  validate(userRegisterSchema, {}, { abortEarly: false }),
  registerUser
);
userRouter.post(
  "/login",
  validate(userLoginSchema, {}, { abortEarly: false }),
  loginUser
);

userRouter.get("/list", getAllUsers);

export default userRouter;
