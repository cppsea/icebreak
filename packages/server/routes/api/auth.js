const express = require("express");
const passport = require("passport");
const router = express.Router();
const token = require("../../utils/token");
const { OAuth2Client, UserRefreshClient } = require('google-auth-library');

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const AuthController = require("../../controllers/auth");
const { response } = require("express");
const postgres = require("../../utils/postgres");
const user = require("../../controllers/users");

//const crypto = require('node:crypto');
const bcrypt = require('bcrypt');

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

// router.get("/google", passport.authenticate("google", {
//   scope: ["profile", "email"],
//   prompt: 'select_account',
// }));

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

router.post("/register", (request, response) => {

  try{
    const { email, password, } = request.body;
    
    if(!email.includes("@") || email.includes(" ")){ // check if email is valid
      throw new Error("Email is invalid.");
    }
    
    if(user.getUserByEmail(email) === null){ // check if email is already in the database
      throw new Error("User already exists with this email");
    }

    /*
    const hash = crypto.createHash('sha256'); // encrypt the user password using sha256
    hash.update(password);
    const encriptedPassword = hash.digest('hex');
    */

    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(password, salt, async function(err, hash) { // encrypt the user password using bcrypt

          // Error caused, schema not yet declared to include password
          await postgres.query(`
            INSERT INTO Users (email, password)
            VALUES ('${email}', '${password}');
          `); // create new user in DB

          const newToken = token.generate({ email, hash}); // create a signed jwt token

          response.send({  // send jwt token
            success: true,
            newToken
            }
          ); 
      });
    });
  }
  catch(error){
    response.status(403).send({
      message: error.message,
      success: false
    });
  }
});


router.post("/login", (request, response) => {
  
  try{
    
    // Get user input
    const { email, password } =  request.body;

    // Validate credentials
    if(!(email && password)){
      throw new Error("All inputs are required");
    }

    // Validate if email is in database
    if(user.getUserByEmail && bcrypt.compare(password, password)){ // check if email is already in the database
        // Create token
        const newToken = token.generate({ email, password});
        response.send({  // send jwt token
          success: true,
          newToken
          }
        ); 
      }
      //res.status(400).send("Invalid Credentials");
    }
    catch(error){
  response.status(400).send({
    message: error.message,
    success: false
  });
}
});

module.exports = router; 