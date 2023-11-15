import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();

import token from "../../utils/token";
import UserController from "../../controllers/users";
import { APIRequest, APIResponse } from "../../types";

type LocalAuthReqBody = {
  email: string;
  password: string;
};

type LocalAuthResponse = {
  user: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
    isNew: boolean;
  };
  accessToken: string;
  refreshToken: string;
};

router.post(
  "/local",
  async (
    request: APIRequest<object, LocalAuthReqBody>,
    response: APIResponse<LocalAuthResponse>
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

export default router;
