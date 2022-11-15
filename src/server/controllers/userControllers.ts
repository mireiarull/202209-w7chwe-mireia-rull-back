import "../../loadEnvironment.js";
import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import type { Error } from "mongoose";
import jwt from "jsonwebtoken";
import CustomError from "../../CustomError/CustomError.js";
import type { UserStructure } from "../../database/models/User.js";
import User from "../../database/models/User.js";
import type { Credentials, RegisterCredentials } from "./types.js";
import environment from "../../loadEnvironment.js";
import type { CustomRequest, UserTokenPayload } from "../../types.js";
import Relationship from "../../database/models/Relationship.js";

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
    const users = await User.find(
      {
        _id: { $ne: userId },
      },
      { password: 0 }
    );

    const usersRelations = await Relationship.find({
      $or: [{ user1: userId }, { user2: userId }],
    });

    res.status(200).json({ users, usersRelations });
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
  const { userId } = req;
  try {
    const { id } = req.params;

    const dbRelations = await Relationship.find({ user1: userId, user2: id });
    const userRelation =
      dbRelations.length > 0 ? dbRelations[0].relation : null;

    const userDb: UserStructure = await User.findById(id);
    if (!userDb) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = {
      username: userDb.username,
      id,
      email: userDb.email,
      name: userDb.name,
      job: userDb.job,
      interest: userDb.interest,
      residence: userDb.residence,
      image: userDb.image,
      backupImage: userDb.backupImage,
      relation: userRelation,
    };

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

export const updateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  try {
    const myUser = await User.findById(userId);

    if (!myUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await User.findByIdAndUpdate(userId, req.body);
    res.status(200).json(req.body);
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Database error updating"
    );
    next(customError);
  }
};

export const getFriends = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  try {
    const users = await User.find(
      {
        _id: { $ne: userId },
      },
      { password: 0 }
    );

    // Const usersRelations = await Relationship.find({
    //   $or: [{ user1: userId }, { user2: userId }],
    // });

    const usersRelations = await Relationship.find({
      $or: [
        {
          $and: [
            { relation: "friends" },
            { $or: [{ user1: userId }, { user2: userId }] },
          ],
        },
      ],
    });
    console.log(usersRelations);

    res.status(200).json({ users, usersRelations });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Database error"
    );
    next(customError);
  }
};
