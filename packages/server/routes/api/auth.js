const express = require("express");
const passport = require("passport");
const router = express.Router();

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const AuthController = require("../../controllers/auth");

passport.serializeUser(AuthController.serializeUser);
passport.deserializeUser(AuthController.deserializeUser);

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, AuthController.createUser));

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "http://localhost:3000",
  session: true
}), (request, response) => {
  response.redirect("http://localhost:3000/feed");
});

module.exports = router;