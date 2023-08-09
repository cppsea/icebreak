const express = require("express");
const passport = require("passport");
const router = express.Router();
const token = require("../../utils/token");
const bcrypt = require("bcrypt");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const AuthController = require("../../controllers/auth");
const UserController = require("../../controllers/users");
const { checkInvalidToken, addToTokenBlacklist } = require("../../utils/redis");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.WEB_CLIENT_ID,
      clientSecret: process.env.WEB_CLIENT_SECRET,
      callbackURL: "http://localhost:5050/api/auth/google/callback",
    },
    AuthController.create
  )
);

passport.serializeUser(AuthController.serialize);
passport.deserializeUser(AuthController.deserialize);

router.get("/user", AuthController.authenticate, (request, response) => {
  try {
    response.status(200).json({
      status: "success",
      data: {
        user: request.user,
      },
    });
  } catch (error) {
    response.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post(
  "/google/login",
  AuthController.login,
  async (request, response) => {
    try {
      const {
        user_id,
        joined_date,
        last_login,
        first_name,
        last_name,
        email,
        avatar,
      } = request.user;

      const accessToken = token.generateAccessToken(request.user);
      const refreshToken = token.generateRefreshToken(request.user);

      response.status(200).json({
        status: "success",
        data: {
          user: {
            userId: user_id,
            firstName: first_name,
            lastName: last_name,
            avatar: avatar,
            email: email,
            joinedDate: joined_date,
            lastLogin: last_login,
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
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "icebreak://",
    session: false,
  }),
  (request, response) => {
    const newToken = token.generate(request.user);
    response.redirect(`icebreak://login?token=${newToken}`);
  }
);

router.post("/register", async (request, response) => {
  try {
    const { firstName, lastName, email, avatar, password } =
      request.body.newUser;

    if (firstName == undefined) {
      return response.status(400).json({
        status: "fail",
        data: {
          email: "First name not provided",
        },
      });
    }

    if (lastName == undefined) {
      return response.status(400).json({
        status: "fail",
        data: {
          email: "Last name not provided",
        },
      });
    }

    if (avatar == undefined) {
      return response.status(400).json({
        status: "fail",
        data: {
          email: "Avatar URL not provided",
        },
      });
    }

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

    await AuthController.register(request.body.newUser);

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

router.post("/local/login", async (request, response) => {
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

    if (isValidPassword) {
      // Generate a refresh token
      const refreshToken = token.generateRefreshToken(requestedUser);

      // Generate an access token
      const accessToken = token.generateAccessToken(requestedUser);

      response.status(200).json({
        status: "success",
        data: {
          user: requestedUser,
          accessToken,
          refreshToken,
        },
      });
    } else {
      response.status(400).json({
        status: "fail",
        data: {
          password: "Password is incorrect",
        },
      });
    }
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/token", async (request, response) => {
  try {
    const { email, refreshToken } = request.body;

    if (!email) {
      return response.status(400).json({
        status: "fail",
        data: {
          email: "Email not provided",
        },
      });
    }

    if (!refreshToken) {
      return response.status(400).json({
        status: "fail",
        data: {
          refreshToken: "Refresh token not provided",
        },
      });
    }

    const requestedUser = await UserController.getUserByEmail(email);
    token.verifyRefreshToken(refreshToken);

    const isInvalidToken = await checkInvalidToken(refreshToken);

    if (isInvalidToken) {
      return response.status(401).json({
        status: "fail",
        data: {
          refreshToken: "Provided refresh token is revoked",
        },
      });
    }

    const accessToken = token.generateAccessToken(requestedUser);
    const newRefreshToken = token.generateRefreshToken(requestedUser);

    response.status(200).json({
      status: "success",
      newRefreshToken,
      accessToken,
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/token/revoke", async (request, response) => {
  try {
    const { refreshToken } = request.body;

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

module.exports = router;
