const express = require("express");
const passport = require("passport");
const router = express.Router();
const token = require("../../utils/token");
const { OAuth2Client } = require('google-auth-library');

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const AuthController = require("../../controllers/auth");

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
    console.log(accessToken);

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

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: 'select_account',
}));

router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "icebreak://",
  session: false
}), (request, response) => {
  const newToken = token.generate(request.user);
  response.redirect(`icebreak://login?token=${newToken}`);
});

module.exports = router;