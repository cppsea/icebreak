const express = require("express");
const passport = require("passport");
const router = express.Router();
const token = require("../../utils/token");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const AuthController = require("../../controllers/auth");

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:5050/api/auth/google/callback"
}, AuthController.createUser));

passport.serializeUser(AuthController.serializeUser);
passport.deserializeUser(AuthController.deserializeUser);

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

router.get('/logout', (request, response) => {
  try {
    console.log(request.user);
    if (request.user) {
      request.logout(() => {
        response.send({
          success: true
        })
      });
    } else {
      response.send({
        success: false,
        message: "No user is in session."
      })
    }
  } catch(error) {
    response.status(403).send({
      success: false,
      message: error.message
    })
  }
});

module.exports = router;