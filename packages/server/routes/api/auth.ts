import express from "express";
import bcrypt from "bcrypt";
import token from "../../utils/token";

const router = express.Router();

import AuthController from "../../controllers/auth";
import UserController from "../../controllers/users";
import { APIRequest, APIResponse } from "../../types";
import { checkInvalidToken, addToTokenBlacklist } from "../../utils/redis";
import { RequestWithUser, UserPayload } from "../../types/auth";

type AuthResponse = {
  user: UserPayload;
  accessToken: string;
  refreshToken: string;
};

router.get(
  "/user",
  AuthController.authenticate,
  (request: RequestWithUser, response: APIResponse<AuthResponse>) => {
    if (!request.user) {
      response.status(500).json({
        status: "error",
        message: "Could not authenticate user"
      });
      return;
    }

    const accessToken = token.generateAccessToken(request.user);
    const refreshToken = token.generateRefreshToken(request.user);

    // destructuring so we don't send JWT iat and expiration properties in
    // response
    const { userId, firstName, lastName, avatar, email, isNew } = request.user;

    response.status(200).json({
      status: "success",
      data: {
        user: {
          userId,
          firstName,
          lastName,
          avatar,
          email,
          isNew
        },
        accessToken,
        refreshToken
      }
    });
  }
);

type GoogleAuthReqBody = {
  token: string;
};

router.post(
  "/google",
  AuthController.login,
  async (
    request: RequestWithUser<object, GoogleAuthReqBody>,
    response: APIResponse<AuthResponse>
  ) => {
    if (!request.user) {
      response.status(500).json({
        status: "error",
        message: "Could not authenticate user"
      });
      return;
    }

    try {
      const { userId, firstName, lastName, email, avatar, isNew } =
        request.user;

      const accessToken = token.generateAccessToken(request.user);
      const refreshToken = token.generateRefreshToken(request.user);

      response.status(200).json({
        status: "success",
        data: {
          user: {
            userId,
            firstName,
            lastName,
            avatar,
            email,
            isNew
          },
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        response.status(500).json({
          status: "error",
          message: error.message
        });
      } else {
        response.status(500).json({
          status: "error",
          message: "Internal Server Error"
        });
      }
    }
  }
);

type LocalAuthReqBody = {
  email: string;
  password: string;
};

router.post(
  "/local/register",
  async (
    request: APIRequest<object, LocalAuthReqBody>,
    response: APIResponse
  ) => {
    try {
      const { email, password } = request.body;

      if (email == undefined) {
        return response.status(400).json({
          status: "fail",
          data: {
            email: "Email not provided"
          }
        });
      }

      if (password === undefined) {
        return response.status(400).json({
          status: "fail",
          data: {
            password: "Password not provided"
          }
        });
      }

      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

      if (!emailRegex.test(email)) {
        // check if email is valid, doesn't include or no spaces
        return response.status(400).json({
          status: "fail",
          data: {
            email: "Invalid email was provided"
          }
        });
      }

      const requestedUser = await UserController.getUserByEmail(email);

      if (requestedUser?.email === email) {
        // check if email is already in the database
        return response.status(400).json({
          status: "fail",
          data: {
            email: "A user with this email already exists."
          }
        });
      }

      await AuthController.register(request.body);

      // users will have to log in manually after successfully registering
      response.status(200).json({
        status: "success",
        data: null
      });
    } catch (error) {
      if (error instanceof Error) {
        response.status(500).json({
          status: "error",
          message: error.message
        });
      } else {
        response.status(500).json({
          status: "error",
          message: "Internal Server Error"
        });
      }
    }
  }
);

router.post(
  "/local",
  async (
    request: APIRequest<object, LocalAuthReqBody>,
    response: APIResponse<AuthResponse>
  ) => {
    try {
      // get user input
      const { email, password } = request.body;

      if (email == undefined) {
        return response.status(400).json({
          status: "fail",
          data: {
            email: "Email not provided"
          }
        });
      }

      if (password == undefined) {
        return response.status(400).json({
          status: "fail",
          data: {
            password: "Password not provided"
          }
        });
      }

      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

      if (!emailRegex.test(email)) {
        // check if email is valid, doesn't include or no spaces
        return response.status(400).json({
          status: "fail",
          data: {
            email: "Invalid email provided"
          }
        });
      }

      const requestedUser = await UserController.getUserByEmail(email);

      if (!requestedUser || requestedUser.email !== email) {
        // check if email is in the database
        return response.status(400).json({
          status: "fail",
          data: {
            email: "A user with that email does not exist."
          }
        });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        requestedUser.password || ""
      );

      if (!isValidPassword) {
        return response.status(400).json({
          status: "fail",
          data: {
            password: "Incorrect password"
          }
        });
      }

      const refreshToken = token.generateRefreshToken(requestedUser);
      const accessToken = token.generateAccessToken(requestedUser);

      response.status(200).json({
        status: "success",
        data: {
          user: {
            userId: requestedUser.userId,
            firstName: requestedUser.firstName,
            lastName: requestedUser.lastName,
            email: requestedUser.email,
            avatar: requestedUser.avatar,
            isNew: requestedUser.isNew
          },
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        response.status(500).json({
          status: "error",
          message: error.message
        });
      } else {
        response.status(500).json({
          status: "error",
          message: "Internal Server Error"
        });
      }
    }
  }
);

type TokenReqBody = {
  refreshToken: string;
};

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

router.post(
  "/token",
  async (
    request: APIRequest<object, TokenReqBody>,
    response: APIResponse<TokenResponse>
  ) => {
    try {
      const { refreshToken } = request.body;

      if (!refreshToken) {
        return response.status(400).json({
          status: "fail",
          data: {
            refreshToken: "Refresh token not provided"
          }
        });
      }

      const isInvalidToken = await checkInvalidToken(refreshToken);

      if (isInvalidToken) {
        return response.status(401).json({
          status: "fail",
          data: {
            refreshToken: "Provided refresh token is revoked"
          }
        });
      }

      const { userId } = await token.verifyRefreshToken(refreshToken);
      const user = await UserController.getUser(userId);

      if (!user) {
        response.status(400).json({
          status: "fail",
          data: {
            refreshToken: "Invalid refresh token provided"
          }
        });
        return;
      }

      const accessToken = token.generateAccessToken(user);
      const newRefreshToken = token.generateRefreshToken(user);

      response.status(200).json({
        status: "success",
        data: {
          accessToken,
          refreshToken: newRefreshToken
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        response.status(500).json({
          status: "error",
          message: error.message
        });
      } else {
        response.status(500).json({
          status: "error",
          message: "Internal Server Error"
        });
      }
    }
  }
);

type RevokeTokenReqBody = {
  refreshToken: string;
};

router.post(
  "/token/revoke",
  async (
    request: APIRequest<object, RevokeTokenReqBody>,
    response: APIResponse
  ) => {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      return response.status(400).json({
        status: "fail",
        data: {
          refreshToken: "Refresh token not provided"
        }
      });
    }

    try {
      token.verifyRefreshToken(refreshToken);

      await addToTokenBlacklist(refreshToken);

      response.status(200).json({
        status: "success",
        data: null
      });
    } catch (error) {
      if (error instanceof Error) {
        response.status(500).json({
          status: "error",
          message: error.message
        });
      } else {
        response.status(500).json({
          status: "error",
          message: "Internal Server Error"
        });
      }
    }
  }
);

export default router;
