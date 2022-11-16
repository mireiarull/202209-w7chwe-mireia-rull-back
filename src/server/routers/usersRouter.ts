import express from "express";
import { validate } from "express-validation";
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

// Const upload = multer({
//   dest: uploadsPath,
//   })

import multer from "multer";
import path from "path";

const upload = multer({
  dest: path.join("assets", "images"),
});

// eslint-disable-next-line new-cap
const userRouter = express.Router();

// UserRouter.post(partialPaths.users.register, upload.single("avatar").validate(.....), create)

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
userRouter.put("/update", auth, upload.single("image"),  updateUser);
userRouter.post("/add-relationship", addRelationship);
userRouter.get("/friends", auth, getFriends);
userRouter.get("/enemies", auth, getEnemies);

export default userRouter;
