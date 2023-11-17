import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
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

function verifyRefreshToken(refreshToken: string): Promise<UserPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.TOKEN_SECRET!, (err, decoded) => {
      if (err) {
        reject(err);
      }

      resolve(decoded as UserPayload);
    });
  });
}

async function verifyAccessToken(accessToken: string): Promise<UserPayload> {
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
        resolve(decoded as UserPayload);
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
