import { User } from "@prisma/client";
import { NewUser, RequestWithUser } from "../types/auth";

import { OAuth2Client } from "google-auth-library";
import { v4 as uuidv4, v5 as uuidv5 } from "uuid";
import prisma from "../utils/prisma";
import token from "../utils/token";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";

const client = new OAuth2Client(process.env.WEB_CLIENT_ID);

const NAMESPACE = "7af17462-8078-4703-adda-be2143a4d93a";

async function authenticateWithGoogle(token: string): Promise<User> {
  // Verify the token is valid; to ensure it's a valid google auth.
  const loginTicket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.WEB_CLIENT_ID
  });
  const payload = loginTicket.getPayload();

  if (!payload) {
    throw new Error("Could not verify with Google.");
  }

  // Check if this user already exist on our database.
  const { sub, email, given_name, family_name, picture } = payload;

  // generate Type 5 UUIDs with hashes of user's google account IDs instead of
  // completely random Type 4 UUIDs to map our generated UUIDs to google
  // accounts
  const googleUUID = uuidv5(sub, NAMESPACE);
  const user = await prisma.user.findUnique({
    where: {
      userId: googleUUID
    }
  });

  // if the query returns a row, there's a user with the existing userId.
  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        // ok type assertions, email and profile scope used by default
        userId: googleUUID,
        email: email as string,
        avatar: picture,
        firstName: given_name as string,
        lastName: family_name as string
      }
    });

    return newUser;
  } else {
    return user;
  }
}

async function register(newUser: NewUser) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(newUser.password, salt);
  const userId = uuidv4();

  // placeholder names until new user puts in their names in onboarding screen
  await prisma.user.create({
    data: {
      userId,
      firstName: "New",
      lastName: "User",
      email: newUser.email,
      password: passwordHash
    }
  });
}

async function login(request: Request, response: Response, next: NextFunction) {
  const provider = request.url.slice(1);

  switch (provider) {
    case "google":
      if (!request.body.token) {
        response.status(400).json({
          status: "fail",
          data: {
            token: "Token not provided"
          }
        });
        return;
      }

      try {
        const user = await authenticateWithGoogle(request.body.token);
        (request as RequestWithUser).user = user;
        next();
      } catch (err) {
        if (err instanceof Error) {
          response.status(500).json({
            status: "error",
            message: err.message
          });
          return;
        }

        response.status(500).json({
          status: "error",
          message: "Internal Server Error"
        });
      }
      break;
    default:
      response.status(500).json({
        status: "error",
        message: "Unsupported authentication provider"
      });
      return;
  }
}

async function authenticate(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.get("Authorization");

  if (!authToken) {
    return response.status(400).json({
      status: "fail",
      data: {
        Authorization: "Token not provided"
      }
    });
  }

  try {
    (request as RequestWithUser).user = await token.verifyAccessToken(
      authToken
    );
    next();
  } catch (error) {
    if (error instanceof Error) {
      switch (error.name) {
        case "TokenExpiredError":
          return response.status(401).json({
            status: "fail",
            data: {
              accessToken: "Token expired"
            }
          });
        default:
          return response.status(500).json({
            status: "error",
            message: error.message
          });
      }
    }

    response.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
}

module.exports = {
  login,
  register,
  authenticate,
  authenticateWithGoogle
};
