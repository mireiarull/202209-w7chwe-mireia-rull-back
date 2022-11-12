import "../../loadEnvironment.js";
import type { NextFunction, Request, Response } from "express";
import debugCreator from "debug";
import CustomError from "../../CustomError/CustomError.js";
import chalk from "chalk";
import { ValidationError } from "express-validation";

const debug = debugCreator("social:server:middlewares:root");

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError(
    "Endpoint not found",
    404,
    "Endpoint not found"
  );
  next(error);
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  debug(chalk.red(error.message));

  const statusCode = error.statusCode ?? 500;
  let publicMessage = error.publicMessage || "Something went wrong";

  if (error instanceof ValidationError) {
    error.details.body.forEach((error) => {
      debug(chalk.red(error.message));
    });
    publicMessage = "Wrong data";
  }

  res.status(statusCode).json({ error: publicMessage });
};
