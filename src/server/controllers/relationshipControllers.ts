import type { NextFunction, Request, Response } from "express";
import CustomError from "../../CustomError/CustomError.js";
import Relationship from "../../database/models/Relationship.js";
import type { RegisterRelationship } from "./types";

export const addRelationship = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user1, user2, relation } = req.body as RegisterRelationship;

  try {
    await Relationship.findOneAndDelete({ user1, user2 });
    await Relationship.findOneAndDelete({ user2, user1 });

    await Relationship.create({
      user1,
      user2,
      relation,
    });

    res.status(201).json(req.body);
  } catch (error: unknown) {
    if ((error as Error).message.includes("duplicate")) {
      const customError = new CustomError(
        (error as Error).message,
        409,
        "Relationship already registered"
      );

      next(customError);
      return;
    }

    const customError = new CustomError(
      (error as Error).message,
      500,
      "Error saving relationship"
    );

    next(customError);
  }
};
