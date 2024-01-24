const { param, body, check } = require("express-validator");

const GuildController = require("../controllers/guilds");

const getGuildValidator = ["Placeholder"];

const createGuildValidator = ["Placeholder"];

const updateGuildValidator = ["Placeholder"];

const deleteGuildValidator = ["Placeholder"];

// temporary to pass Eslint
console.log(param, body, check, GuildController);

module.exports = {
  getGuildValidator,
  createGuildValidator,
  updateGuildValidator,
  deleteGuildValidator,
};
