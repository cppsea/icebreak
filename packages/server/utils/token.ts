import { User } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserPayload } from "../types/auth";

function generateRefreshToken(user: User | UserPayload) {
  const { userId } = user;
  return jwt.sign(
    {
      userId
    },
    process.env.TOKEN_SECRET!,
    {
      expiresIn: "1d"
    }
  );
}

function generateAccessToken(user: User | UserPayload) {
  const { userId, firstName, lastName, avatar, email } = user;
  return jwt.sign(
    {
      userId,
      firstName,
      lastName,
      avatar,
      email
    },
    process.env.WEB_CLIENT_SECRET!,
    {
      expiresIn: "1h"
    }
  );
}

async function verifyRefreshToken(refreshToken: string) {
  return jwt.verify(refreshToken, process.env.TOKEN_SECRET!);
}

async function verifyAccessToken(accessToken: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      accessToken,
      process.env.WEB_CLIENT_SECRET!,
      function (err, decoded) {
        if (err) {
          reject(err);
        }
        // Token is valid
        // resolve promise with the payload of the access token
        resolve(decoded as jwt.JwtPayload);
      }
    );
  });
}

export default {
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken,
  verifyAccessToken
};
