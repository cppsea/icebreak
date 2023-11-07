import { Request } from "express";

// extending json web token payloads with necessary user properties
// for our authorization
declare module "jsonwebtoken" {
  export interface JwtPayload {
    userId: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    email: string;
  }
}

export type NewUser = {
  email: string;
  password: string;
};

export type RefreshTokenPayload = {
  userId: string;
};

// user info stored in JWT payloads
export type UserPayload = {
  userId: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  email: string;
};

export interface RequestWithUser extends Request {
  user: UserPayload;
}
