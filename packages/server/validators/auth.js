const { body } = require("express-validator");

const passwordResetValidator = [
  body("token", "Invalid token.")
    .exists({ checkFalsy: true })
    .withMessage("Token can't be null or empty.")
    .trim(),

  body("password", "Invalid password.")
    .exists({ checkFalsy: true })
    .withMessage("Password can't be null or empty.")
    .trim(),
];

module.exports = {
  passwordResetValidator,
};
