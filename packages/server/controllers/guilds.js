const { postgres } = require("../utils/postgres");

async function getAllGuilds() {
  const query = await postgres.query("SELECT * FROM guilds");
  return query.rows;
}

async function getGuild(guildId) {
  const query = await postgres.query(
    `SELECT * FROM guilds WHERE guild_id='${guildId}'`
  );
  return query.rows[0];
}

module.exports = {
  getGuild,
  getAllGuilds,
};
