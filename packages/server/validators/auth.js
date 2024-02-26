const { body } = require("express-validator");

const forgotPasswordValidator = [
  body("email", "Invalid email.")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("email can't be null or empty.")
    .isEmail()
    .withMessage("Invalid email entered!"),
];

module.exports = {
  forgotPasswordValidator,
};
