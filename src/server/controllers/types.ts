import type { JwtPayload } from "jsonwebtoken";

export interface Credentials {
  username: string;
  password: string;
}

export interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
}

export interface RegisterCredentials extends Credentials {
  email: string;
  name: string;
  job: string;
}

export interface CustomRequest extends Request {
  userId: string;
}

export interface ItemId {
  id: string;
}
