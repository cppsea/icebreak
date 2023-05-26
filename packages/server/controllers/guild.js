const { postgres } = require("../utils/postgres");

async function getAllGuild() {
  const query = await postgres.query("SELECT * FROM guild");
  return query.rows;
}

async function getGuild(guildId) {
  const query = await postgres.query(
    `SELECT * FROM guild WHERE guild_id='${guildId}'`
  );
  return query.rows[0];
}

module.exports = {
  getGuild,
  getAllGuild,
};
