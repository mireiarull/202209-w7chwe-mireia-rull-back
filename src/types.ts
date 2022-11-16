import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { RegisterCredentials } from "./server/controllers/types";

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

// Export interface CustomRequest extends Partial<Request<string, unknown> , Record <string, unknown>, RegisterCredentials> {
//   userId: string;

// }
