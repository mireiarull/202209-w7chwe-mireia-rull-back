import express from "express";
import { validate } from "express-validation";
import multer from "multer";
import path from "path";
import {
  getAllUsers,
  getEnemies,
  getFriends,
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
import { partialPaths } from "../paths.js";

const upload = multer({
  dest: path.join("assets", "images"),
});

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post(
  partialPaths.users.register,
  validate(userRegisterSchema, {}, { abortEarly: false }),
  registerUser
);

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
userRouter.put("/update", auth, upload.single("image"), updateUser);
userRouter.post("/add-relationship", addRelationship);
userRouter.get("/friends", auth, getFriends);
userRouter.get("/enemies", auth, getEnemies);

export default userRouter;
