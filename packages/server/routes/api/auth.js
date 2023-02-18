const express = require("express");
const passport = require("passport");
const router = express.Router();
const token = require("../../utils/token");
const { OAuth2Client, JWT } = require('google-auth-library');
const bcrypt = require('bcrypt');
const uniqid = require('uniqid'); 
const tokenList = {};
const jwt = require('jsonwebtoken');


const GoogleStrategy = require("passport-google-oauth20").Strategy;

const AuthController = require("../../controllers/auth");
const postgres = require("../../utils/postgres");
const user = require("../../controllers/users");

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:5050/api/auth/google/callback"
}, AuthController.create));

passport.serializeUser(AuthController.serialize);
passport.deserializeUser(AuthController.deserialize);

const CLIENT_ID = '1080245081969-u9lnl9ospj757rq75kiumttqconhnfcc.apps.googleusercontent.com';

const client = new OAuth2Client(CLIENT_ID);
router.post('/verify', async (request, response) => {
  try {
    const { accessToken } = request.body;
    if (accessToken == undefined) {
      throw new Error("AccessToken isn't defined in body.");
    }

    const { payload } = await client.verifyIdToken({
      idToken: accessToken,
      audience: CLIENT_ID
    });

    response.send({
      success: true,
      payload: {
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture
      }
    });

  } catch(error) {
    response.send({
      message: error.message,
      success: false
    });
  }
});

router.get('/user', AuthController.authenticate, (request, response) => {
  try {
    response.send(request.user);
  } catch(error) {
    response.status(403).send({
      message: error.message,
      success: false
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
      avatar
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
        lastLogin: last_login
      }
    });
  } catch(error) {
    response.status(403).send({
      message: error.message,
      success: false
    });
  }
});

router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "icebreak://",
  session: false
}), (request, response) => {
  const newToken = token.generate(request.user);
  response.redirect(`icebreak://login?token=${newToken}`);
});

router.post("/register", async (request, response) => {
  try {
    const { email, password } = request.body;

    if (email == undefined || password == undefined) {
      return response.status(400).send({
        message: "Email and Passsword must be provided.",
        success: false
      });
    }

    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if(!emailRegex.test(email)){ // check if email is valid, doesn't include or no spaces
      throw new Error("Email is invalid.");
    }

    const requestedUser = await user.getUserByEmail(email);

    if(requestedUser?.email === email){ // check if email is already in the database
      throw new Error("User already exists with this email.");
    }

    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, function(error, salt) {
      bcrypt.hash(password, salt, async function(error, hash) { // encrypt the user password using bcrypt

        // create unique User ID as bytes (18 byte)
        const user_id = uniqid();

        await postgres.query(`
          INSERT INTO users (user_id, first_name, last_name, email, avatar, password)
          VALUES ('${user_id}', 'firstName', 'lastName', '${email}', 'avatar', '${hash}');
        `); // create new user in DB, (DO NOT STORE ACTUAL PASSWORD, STORE HASHED VERSION)
        
        const newToken = token.generate({ email }); // create a signed jwt token

        response.send({
          success: true,
          newToken
        }); 

      });
    });
  } catch(error) {
    response.status(403).send({
      message: error.message,
      success: false
    });
  }
});

router.post("/login", async (request, response) => {
  try {
    // Get user input
    const { email, password } =  request.body;

    if (email == undefined || password == undefined) {
      return response.status(400).send({
        message: "email and passsword must be provided.",
        success: false
      });
    }

    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if(!emailRegex.test(email)){ // check if email is valid, doesn't include or no spaces
      throw new Error("Email is invalid.");
    }

    const requestedUser = await user.getUserByEmail(email);

    if(requestedUser?.email !== email){ // check if email is in the database
      throw new Error("Email does not exist.");
    }
    
    const isValidPassword = await bcrypt.compare(password, requestedUser.password); 
    if (isValidPassword) {
      const newToken = jwt.sign({email}, process.env.CLIENT_SECRET, { expiresIn: '1h'} );
      const refreshToken = jwt.sign({email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
      tokenList[refreshToken] = response;
      response.send({  
        success: true,
        newToken,
        refreshToken
      }); 
    } else {
      response.send({
        message: "Password was incorrect.",
        success: false
      });
    }

  } catch(error) {
    response.status(403).send({
      message: error.message,
      success: false
    });
  }
});

router.post("/token", async (request, response) => {
  try{

      const {email, refreshToken} = request.body;
      //const getUser = await user.getUserByEmail(email);

      //if the refresh token exists
      if((refreshToken) && (refreshToken in tokenList)) {
      
      //creates new token
      const token = jwt.sign({email}, process.env.CLIENT_SECRET,  {expiresIn: '1h'});
      //updates token in the list 
      tokenList[refreshToken].token = token;
        response.send({
            token
        });
      }else {
        response.send({
          message: "Invalid Request",
          success: false

      });
    }
    } catch(error) {
      response.status(403).send({
        message: error.message,
        success: false
      });

  }
});

module.exports = router; 