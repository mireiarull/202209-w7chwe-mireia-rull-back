import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  userId: string;
}

export interface ItemId {
  id: string;
}

export interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
}
