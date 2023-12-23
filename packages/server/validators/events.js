const { param } = require("express-validator");

// validators are defined as an array of checks to perform with express-validator
const createEventValidator = [
  // example check for making sure guildId route parameter is a UUID
  // modify this param("guildId") check for the other checks I listed in the PR review for "guildId"
  param("guildId", "Invalid guild ID")
    .trim()
    .escape()
    .isUUID()
    .withMessage("Not a UUID"),
  //   add more checks for the create event route below this line as part of this array
];

module.exports = {
  createEventValidator,
};
