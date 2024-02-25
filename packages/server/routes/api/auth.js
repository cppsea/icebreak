const express = require("express");
const router = express.Router();
const token = require("../../utils/token");
const bcrypt = require("bcrypt");

const AuthController = require("../../controllers/auth");
const UserController = require("../../controllers/users");
const TokenGenerator = require("../../utils/token");
const { checkInvalidToken, addToTokenBlacklist } = require("../../utils/redis");

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

router.post("/forgot-password", async (request, response) => {
  try {
    // TODO: Implement /forgot-password route
    const { email } = request.body;
    
    const verifyEmailResult = await AuthController.verifyEmail(email);
    // Check if email exists, then if email is a Google OAuth Account
    if (!verifyEmailResult) {
      return response.status(400).json({
        status: "fail",
        data: {
          message: "User with given email does not exist.",
        }
      })
    }

    const isGoogleAccountResult = await AuthController.isGoogleAccount(email);

    if (isGoogleAccountResult) {
      return response.status(400).json({
        status: "fail",
        data: {
          message: "User with given email is a Google OAuth account.",
        }
      })
    }

    
    // After both email and google oauth checks, call 
    // generate json webtoken function
    const user = await UserController.getUserByEmail(email);

    const refreshToken = TokenGenerator.generateResetPasswordToken(user);

    
    // use template literal to append route

    // 
  }
  catch (error) {
    console.log(error);
  }
})

module.exports = router;
