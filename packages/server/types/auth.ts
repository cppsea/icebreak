import { APIRequest } from ".";

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
  isNew: boolean;
};

export interface RequestWithUser<T = Record<string, never>, V = void>
  extends APIRequest<T, V> {
  user?: UserPayload;
}
