import express from "express";
import { validate } from "express-validation";
import {
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/userControllers.js";
import auth from "../middlewares/auth.js";
import {
  userLoginSchema,
  userRegisterSchema,
} from "../controllers/schemas/userCredentialsSchema.js";
import { addRelationship } from "../controllers/relationshipControllers.js";

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

userRouter.get("/list", auth, getAllUsers);
userRouter.get("/profile/:id", auth, getUserById);
userRouter.put("/update", auth, updateUser);
userRouter.post("/addRelationship", addRelationship);

export default userRouter;
