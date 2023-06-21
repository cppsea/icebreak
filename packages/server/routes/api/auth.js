const express = require("express");
const passport = require("passport");
const router = express.Router();
const token = require("../../utils/token");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcrypt");
const uniqid = require("uniqid");
const tokenList = {};
const jwt = require('jsonwebtoken');


const GoogleStrategy = require("passport-google-oauth20").Strategy;

const AuthController = require("../../controllers/auth");
const postgres = require("../../utils/postgres");
const user = require("../../controllers/users");
const { isTokenValid, addToBlacklist, redisClient } = require("../../utils/redis");

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
      throw new Error("AccessToken isn't defined in body.");
    }

    const { payload } = await client.verifyIdToken({
      idToken: accessToken,
      audience: WEB_CLIENT_ID,
    });

    response.send({
      success: true,
      payload: {
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
      },
    });
  } catch (error) {
    response.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/user", AuthController.authenticate, (request, response) => {
  try {

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (request.user.exp < currentTimestamp) {
      throw new Error("Access token has expired");
    }
    
    response.send(request.user);
  } catch (error) {
    response.status(403).send({
      success: false,
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

    response.send({
      success: true,
      payload: {
        userId: user_id,
        firstName: first_name,
        lastName: last_name,
        avatar: avatar,
        email: email,
        joinedDate: joined_date,
        lastLogin: last_login,
      },
    });
  } catch (error) {
    response.status(403).send({
      success: false,
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

let refreshToken = '';
let accessToken = '';

router.post("/register", async (request, response) => {
  try {
    const { email, password } = request.body;

    if (email == undefined || password == undefined) {
      return response.status(400).send({
        success: false,
        message: "Email and Passsword must be provided.",
      });
    }

    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!emailRegex.test(email)) {
      // check if email is valid, doesn't include or no spaces
      throw new Error("Email is invalid.");
    }

    const requestedUser = await user.getUserByEmail(email);

    if (requestedUser?.email === email) {
      // check if email is already in the database
      throw new Error("User already exists with this email.");
    }

    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, function (error, salt) {
      bcrypt.hash(password, salt, async function (error, hash) {
        // encrypt the user password using bcrypt

        // create unique User ID as bytes (18 byte)
        const user_id = uniqid();

        const { Client: PostgresClient } = require("pg");

        const postgres = new PostgresClient({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT,
        });

        await postgres.connect(); 

        await postgres.query(`
          INSERT INTO users (user_id, first_name, last_name, email, avatar, password)
          VALUES ('${user_id}', 'firstName', 'lastName', '${email}', 'avatar', '${hash}');
        `); // create new user in DB, (DO NOT STORE ACTUAL PASSWORD, STORE HASHED VERSION)

        // Generate a refresh token
        refreshToken = token.generateRefreshToken(requestedUser);

        // create a signed jwt token
        accessToken = token.generateAccessToken(requestedUser);

        // Store the refresh token and its associated access token in tokenList
        tokenList[refreshToken] = accessToken ;
        
        response.send({
          success: true,
          refreshToken,
          accessToken,
        });
      });
    });
  } catch (error) {
    response.status(403).send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/login", async (request, response) => {
  try {
    // Get user input
    const { email, password } = request.body; 

    if (email == undefined || password == undefined) {
      return response.status(400).send({
        success: false,
        message: "email and passsword must be provided.",
      });
    }

    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!emailRegex.test(email)) {
      // check if email is valid, doesn't include or no spaces
      throw new Error("Email is invalid.");
    }

    const requestedUser = await user.getUserByEmail(email);

    if (requestedUser?.email !== email) {
      // check if email is in the database
      throw new Error("Email does not exist.");
    }

    const isValidPassword = await bcrypt.compare(
      password,
      requestedUser.password
    );

    if (isValidPassword) {

    // Generate a refresh token
    refreshToken = token.generateRefreshToken(requestedUser);

    // Generate an access token
    accessToken = token.generateAccessToken(requestedUser);      
    
    // Store the refresh token and its associated access token in tokenList
    tokenList[refreshToken] = accessToken ;

    response.send({
        success: true,
        refreshToken,
        accessToken,
      });
    } else {
      response.send({
        success: false,
        message: "Password was incorrect.",
      });
    }
  } catch (error) {
    response.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

router.post('/token', async (request, response) => {
  try {
    const{ email, refreshToken } = request.body;
    const requestedUser = await user.getUserByEmail(email);
    // Check if refresh token is provided
    if (refreshToken) {
      // Verify the refresh token
      token.verifyRefreshToken(refreshToken);
      
          // Check if the refresh token exists in tokenList
          if (refreshToken in tokenList) {
            // Generate a new access token
            accessToken = token.generateAccessToken(requestedUser);      

            //Generates a new refresh token
            const newRefreshToken = token.generateRefreshToken(requestedUser);
            // Update the tokenList with the new refresh token
            tokenList[newRefreshToken] = tokenList[refreshToken];
            delete tokenList[refreshToken];
            // Update the access token in tokenList
            tokenList[newRefreshToken] = accessToken;
            // Send the new access token and refresh token in the response
            response.send({
              success: true,
              newRefreshToken,
              accessToken,
            });
          } else {
            response.status(401).send({
              success: false,
              message: 'Invalid Refresh Token'
            });
          }
      
    } else {
      response.status(401).send({
        success: false,
        message: 'Refresh Token Required'
      });
    }
  } catch (error) {
    response.status(500).send({
      success: false,
      message: error.message
    });
  }
});

router.post('/revokeToken', async (request, response) => {
  try {
    const { refreshToken } = request.body;

    // Verify the refresh token
    token.verifyRefreshToken(refreshToken);

    // Store the revoked token in Redis set
    addToBlacklist(refreshToken, (error) => {
      if (error) {
        response.status(500).send({
          success: false,
          message: "Error revoking token", error
        });
    }else{
        response.status(200).send({
          success: true,
          message: "Token has been revoked."
        });
  }
});

  } catch (error) {
    response.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


module.exports = router;
