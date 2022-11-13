import "../../loadEnvironment.js";
import fs from "fs/promises";
import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import type { Error } from "mongoose";
import jwt from "jsonwebtoken";
import CustomError from "../../CustomError/CustomError.js";
import User from "../../database/models/User.js";
import type { Credentials, RegisterCredentials } from "./types.js";
import environment from "../../loadEnvironment.js";
import type { CustomRequest, UserTokenPayload } from "../../types.js";
import { createClient } from "@supabase/supabase-js";
import path from "path";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email, name, job } =
    req.body as RegisterCredentials;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      name,
      job,
    });

    const tokenPayload: UserTokenPayload = {
      username,
      id: newUser._id.toString(),
    };

    const token = jwt.sign(tokenPayload, environment.jwtSecret, {
      expiresIn: "2d",
    });

    res
      .status(201)
      .json({ id: newUser._id, username, email, name, job, token });
  } catch (error: unknown) {
    if ((error as Error).message.includes("duplicate")) {
      const customError = new CustomError(
        (error as Error).message,
        409,
        "User already registered"
      );

      next(customError);
      return;
    }

    const customError = new CustomError(
      (error as Error).message,
      500,
      "Error saving user"
    );

    next(customError);
  }
};

export const loginUser = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, Credentials>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      const error = new CustomError(
        "Username not found",
        401,
        "Wrong credentials"
      );
      next(error);
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const error = new CustomError(
        "Password is incorrect",
        401,
        "Wrong credentials"
      );
      next(error);
      return;
    }

    const tokenPayload: UserTokenPayload = {
      username,
      id: user._id.toString(),
    };

    const token = jwt.sign(tokenPayload, environment.jwtSecret, {
      expiresIn: "2d",
    });

    res.status(200).json({ token });
  } catch (error: unknown) {
    next(error);
  }
};

export const getAllUsers = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  try {
    const users = await User.find({
      _id: { $ne: userId },
    });
    res.status(200).json({ users });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Database error"
    );
    next(customError);
  }
};

export const getUserById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Database error"
    );
    next(customError);
  }
};

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
const bucket = supabase.storage.from(environment.supabaseBucketId);

export const updateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  // Const timeStamp = Date.now();

  // const newFilePath = path.join(
  //   "assets",
  //   "images",
  //   req.file.originalname.split(".").join(`${timeStamp}.`)
  // );

  // const fileUrl = `${req.protocol}://${req.hostname}/${newFilePath.replaceAll(
  //   `\\`,
  //   "/"
  // )}`;
  console.log(req.body);

  try {
    const newItemFileName = req.file.filename + req.file.originalname;

    // Await fs.rename(
    //   path.join("assets", "images", req.file.filename),
    //   newFilePath
    // );

    await fs.rename(
      path.join("assets", "images", req.file.filename),
      path.join("assets", "images", newItemFileName)
    );

    const userFileContent = await fs.readFile(
      path.join("assets", "images", newItemFileName)
    );

    await bucket.upload(newItemFileName, userFileContent);

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(newItemFileName);

    const myUser = await User.findById(userId);

    if (!myUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      ...req.body,
      image: newItemFileName,
      backupImage: publicUrl,
    });

    console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Database error updating"
    );
    next(customError);
  }
};
