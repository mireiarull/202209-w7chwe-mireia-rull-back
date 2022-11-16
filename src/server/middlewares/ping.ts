import type { NextFunction, Request, Response } from "express";

export const ping = (req: Request, res: Response, next: NextFunction) => {
  res.json("ok");
  next();
};
