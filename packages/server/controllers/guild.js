const { postgres } = require("../utils/postgres");

async function getAllGuild() {
  const query = await postgres.query("SELECT * FROM guild");
  return query.rows;
}

async function insertGuild(guildData) {
  const {
    title,
    handler,
    description,
    category,
    bannerUrl,
    iconUrl,
    location,
    websiteUrl,
    tags,
    twitterUrl,
    facebookUrl,
    instagramUrl,
    discordUrl,
    linkedinUrl,
    githubUrl,
    isInviteOnly,
  } = guildData;

  if (
    bannerUrl === undefined ||
    iconUrl === undefined ||
    handler === undefined ||
    title === undefined ||
    description === undefined ||
    category === undefined ||
    tags === undefined ||
    isInviteOnly === undefined
  ) {
    throw new Error("Missing guild properties in request.");
  }

  const queryString =
    "INSERT INTO guild VALUES(gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *";
  const media = [
    twitterUrl,
    facebookUrl,
    instagramUrl,
    discordUrl,
    linkedinUrl,
    githubUrl,
  ];
  const queryValues = [
    title,
    handler,
    description,
    category,
    location,
    websiteUrl,
    tags,
    bannerUrl,
    iconUrl,
    media,
    isInviteOnly,
  ];

  const query = await postgres.query(queryString, queryValues);
  return query.rows[0];
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
  insertGuild,
};
