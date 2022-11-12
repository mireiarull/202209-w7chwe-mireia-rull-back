import express from "express";
import { registerUser } from "../contollers/userControllers.js";

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post("/register", registerUser);

export default userRouter;
