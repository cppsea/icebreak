import express from "express";
const router = express.Router();

import UserController from "../../controllers/users";
import AuthController from "../../controllers/auth";

router.get("/", async (request, response) => {
  try {
    const users = await UserController.getAllUsers();
    response.status(200).json({
      status: "success",
      data: {
        users
      }
    });
    return;
  } catch (error) {
    if (error instanceof Error) {
      response.status(500).json({
        status: "error",
        message: error.message
      });
      return;
    }

    response.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
    return;
  }
});

router.get(
  "/:userId",
  AuthController.authenticate,
  async (request, response) => {
    try {
      const { userId } = request.params;

      if (userId === undefined) {
        response.status(400).json({
          status: "fail",
          data: {
            userId: "User ID not provided"
          }
        });
        return;
      }

      const user = await UserController.getUser(userId);
      response.status(200).json({
        status: "success",
        data: {
          user: user
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        response.status(500).json({
          status: "error",
          message: error.message
        });
        return;
      }

      response.status(500).json({
        status: "error",
        message: "Internal Server Error"
      });
      return;
    }
  }
);

export default router;
