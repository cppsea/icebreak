const express = require("express");
const router = express.Router();
const token = require("../../utils/token");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const { passwordResetValidator } = require("../../validators/auth");
const { validationResult, matchedData } = require("express-validator");

const AuthController = require("../../controllers/auth");
const UserController = require("../../controllers/users");
const {
  checkInvalidToken,
  addToTokenBlacklist,
  checkInvalidPasswordResetToken,
  addToPasswordResetTokenBlacklist,
} = require("../../utils/redis");

const { verifyPasswordResetToken } = require("../../utils/token");

router.get("/user", AuthController.authenticate, (request, response) => {
  const accessToken = token.generateAccessToken(request.user);
  const refreshToken = token.generateRefreshToken(request.user);

  // destructuring so we don't send JWT iat and expiration properties in
  // response
  const { userId, firstName, lastName, avatar, email } = request.user;

  response.status(200).json({
    status: "success",
    data: {
      user: {
        userId,
        firstName,
        lastName,
        avatar,
        email,
      },
      accessToken,
      refreshToken,
    },
  });
});

router.post("/google", AuthController.login, async (request, response) => {
  try {
    const { userId, firstName, lastName, email, avatar, isNew } = request.user;

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
          isNew,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/local/register", async (request, response) => {
  try {
    const { email, password } = request.body;

    if (email == undefined) {
      return response.status(400).json({
        status: "fail",
        data: {
          email: "Email not provided",
        },
      });
    }

    if (password === undefined) {
      return response.status(400).json({
        status: "fail",
        data: {
          password: "Password not provided",
        },
      });
    }

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!emailRegex.test(email)) {
      // check if email is valid, doesn't include or no spaces
      return response.status(400).json({
        status: "fail",
        data: {
          email: "Invalid email was provided",
        },
      });
    }

    const requestedUser = await UserController.getUserByEmail(email);

    if (requestedUser?.email === email) {
      // check if email is already in the database
      return response.status(400).json({
        status: "fail",
        data: {
          email: "A user with this email already exists.",
        },
      });
    }

    await AuthController.register(request.body);

    // users will have to log in manually after successfully registering
    response.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/local", async (request, response) => {
  try {
    // get user input
    const { email, password } = request.body;

    if (email == undefined) {
      return response.status(400).json({
        status: "fail",
        data: {
          email: "Email not provided",
        },
      });
    }

    if (password == undefined) {
      return response.status(400).json({
        status: "fail",
        data: {
          password: "Password not provided",
        },
      });
    }

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!emailRegex.test(email)) {
      // check if email is valid, doesn't include or no spaces
      return response.status(400).json({
        status: "fail",
        data: {
          email: "Invalid email provided",
        },
      });
    }

    const requestedUser = await UserController.getUserByEmail(email);

    if (requestedUser?.email !== email) {
      // check if email is in the database
      return response.status(400).json({
        status: "fail",
        data: {
          email: "A user with that email does not exist.",
        },
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      requestedUser.password
    );

    if (!isValidPassword) {
      return response.status(400).json({
        status: "fail",
        data: {
          password: "Incorrect password",
        },
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
          isNew: requestedUser.isNew,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/token", async (request, response) => {
  try {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      return response.status(400).json({
        status: "fail",
        data: {
          refreshToken: "Refresh token not provided",
        },
      });
    }

    const isInvalidToken = await checkInvalidToken(refreshToken);

    if (isInvalidToken) {
      return response.status(401).json({
        status: "fail",
        data: {
          refreshToken: "Provided refresh token is revoked",
        },
      });
    }

    const { userId } = token.verifyRefreshToken(refreshToken);
    const user = await UserController.getUser(userId);

    const accessToken = token.generateAccessToken(user);
    const newRefreshToken = token.generateRefreshToken(user);

    response.status(200).json({
      status: "success",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/token/revoke", async (request, response) => {
  const { refreshToken } = request.body;

  if (!refreshToken) {
    return response.status(400).json({
      status: "fail",
      data: {
        refreshToken: "Refresh token not provided",
      },
    });
  }

  try {
    token.verifyRefreshToken(refreshToken);

    await addToTokenBlacklist(refreshToken);

    response.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post(
  "/password/reset",
  passwordResetValidator,
  async (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: result.array(),
      });
    }

    const data = matchedData(request);

    try {
      const token = data.token;
      const password = data.password;

      const { userId } = verifyPasswordResetToken(token);
      if (!userId || !uuid.validate(userId)) {
        return response.status(400).json({
          status: "fail",
          message: "Invalid user ID was associated with the provided token!",
        });
      }

      // TODO: Since the token will be encrypted, I might have to use bcrypt.compare here instead.
      const redisValidate = await checkInvalidPasswordResetToken(token);
      if (redisValidate) {
        return response.status(400).json({
          status: "fail",
          message: "This password reset token is expired/invalid!",
        });
      }

      await AuthController.resetPassword(userId, password);

      // TODO: encrypt the token before adding it to the blacklist
      await addToPasswordResetTokenBlacklist(token);
      response.status(200).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

module.exports = router;
