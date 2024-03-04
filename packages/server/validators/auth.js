const { body } = require("express-validator");
const AuthController = require("../controllers/auth");
const UserController = require("../controllers/users");
const { checkInvalidPasswordResetToken } = require("../utils/redis");

const forgotPasswordValidator = [
  body("email", "Invalid email.")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Email can't be null or empty.")
    .isEmail()
    .withMessage("Invalid email entered!")

    // Check If User Exists in DB & If User is a Google OAuth Acc
    .custom(async (email) => {
      const userExists = await AuthController.isUserEmail(email);
      if (!userExists) {
        throw new Error("User with given email does not exist.");
      }

      const userId = await UserController.getUserIdByEmail(email);
      const isGoogleAccount = await AuthController.isGoogleAccount(userId);
      if (isGoogleAccount) {
        throw new Error("Please login using Google.");
      }
    }),
];

const passwordResetValidator = [
  body("token", "Invalid token.")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Token can't be null or empty.")

    // Check if the password reset token has been used before.
    .custom(async (token) => {
      const isUsedToken = await checkInvalidPasswordResetToken(token);
      if (isUsedToken) {
        throw new Error("This password reset token is expired/invalid!");
      }
    }),

  body("password", "Invalid password.")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Password can't be null or empty."),
];

module.exports = {
  forgotPasswordValidator,
  passwordResetValidator,
};
