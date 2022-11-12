import type { JwtPayload } from "jsonwebtoken";

export interface Credentials {
  username: string;
  password: string;
  email: string;
}

export interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
}
