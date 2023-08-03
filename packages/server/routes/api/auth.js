const express = require("express");
const passport = require("passport");
const router = express.Router();
const token = require("../../utils/token");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const AuthController = require("../../controllers/auth");
const { postgres } = require("../../utils/postgres");
const user = require("../../controllers/users");
const { isTokenValid, addToBlacklist } = require("../../utils/redis");

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

const client = new OAuth2Client(process.env.WEB_CLIENT_ID);
router.post("/verify", async (request, response) => {
  try {
    const { accessToken } = request.body;
    if (accessToken == undefined) {
      return response.status(400).json({
        status: "fail",
        data: {
          accessToken: "Access token not provided.",
        },
      });
    }

    const { payload } = await client.verifyIdToken({
      idToken: accessToken,
      audience: process.env.WEB_CLIENT_ID,
    });

    response.status(200).json({
      status: "success",
      data: {
        user: {
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          picture: payload.picture,
        },
      },
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

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

router.post("/google", AuthController.login, async (request, response) => {
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
});

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

    const requestedUser = await user.getUserByEmail(email);

    if (requestedUser?.email === email) {
      // check if email is already in the database
      return response.status(400).json({
        status: "fail",
        data: {
          email: "A user with this email already exists.",
        },
      });
    }

    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, function (error, salt) {
      bcrypt.hash(password, salt, async function (error, hash) {
        // encrypt the user password using bcrypt

        // create unique User ID as bytes (18 byte)
        const userId = uuidv4();

        await postgres.query(`
          INSERT INTO users (user_id, first_name, last_name, email, avatar, password)
          VALUES ('${userId}', 'firstName', 'lastName', '${email}', 'avatar', '${hash}');
        `); // create new user in DB, (DO NOT STORE ACTUAL PASSWORD, STORE HASHED VERSION)

        // users will have to log in manually after successfully registering
        response.status(200).json({
          status: "success",
          data: null,
        });
      });
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/login", async (request, response) => {
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

    const requestedUser = await user.getUserByEmail(email);

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
    const requestedUser = await user.getUserByEmail(email);
    // Check if refresh token is provided
    if (refreshToken) {
      // Verify the refresh token
      token.verifyRefreshToken(refreshToken);

      //Checks refresh token against a blacklist of revoked tokens
      isTokenValid(refreshToken, (error, isRevoked) => {
        if (error) {
          response.status(500).json({
            status: "error",
            message: error.message,
          });
        } else if (isRevoked) {
          // Token is blacklisted
          response.status(401).json({
            status: "fail",
            data: {
              refreshToken: "Provided refresh token is revoked",
            },
          });
        } else {
          // Generate a new access token
          const accessToken = token.generateAccessToken(requestedUser);

          //Generates a new refresh token
          const newRefreshToken = token.generateRefreshToken(requestedUser);

          // Send the new access token and refresh token in the response
          response.status(200).json({
            status: "success",
            newRefreshToken,
            accessToken,
          });
        }
      });
    } else {
      response.status(400).json({
        status: "fail",
        data: {
          refreshToken: "Refresh token not provided",
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

router.post("/revoke-token", async (request, response) => {
  try {
    const { refreshToken } = request.body;

    // Verify the refresh token
    token.verifyRefreshToken(refreshToken);

    // Store the revoked token in Redis set
    addToBlacklist(refreshToken, (error) => {
      if (error) {
        response.status(500).json({
          status: "error",
          message: error.message,
        });
      } else {
        response.status(200).json({
          status: "success",
          message: "Token has been revoked.",
        });
      }
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
