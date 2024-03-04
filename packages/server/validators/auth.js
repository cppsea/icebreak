const { body } = require("express-validator");

const forgotPasswordValidator = [
  body("email", "Invalid email.")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Email can't be null or empty.")
    .isEmail()
    .withMessage("Invalid email entered!"),
];

const passwordResetValidator = [
  body("token", "Invalid token.")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Token can't be null or empty."),

  body("password", "Invalid password.")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Password can't be null or empty."),
];

module.exports = {
  forgotPasswordValidator,
  passwordResetValidator,
};
