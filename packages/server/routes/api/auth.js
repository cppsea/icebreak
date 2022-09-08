const express = require("express");
const passport = require("passport");
const router = express.Router();

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const AuthController = require("../../controllers/auth");

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:5050/api/auth/google/callback"
}, AuthController.createUser));

passport.serializeUser(AuthController.serializeUser);
passport.deserializeUser(AuthController.deserializeUser);

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "icebreak://",
  session: true
}), (request, response) => {
  console.log(request.isAuthenticated());
  response.redirect(`icebreak://login?user=${JSON.stringify(request.user)}`);
  // response.redirect(`http://localhost:3000/feed`);
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