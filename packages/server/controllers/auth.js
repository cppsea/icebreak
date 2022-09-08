const postgres = require("../utils/postgres");

async function createUser(accessToken, refreshToken, profile, callback) {
  try {
    let { sub: id, given_name, family_name, picture, email } = profile._json;
    picture = picture.replace("=s96-c", "");
    const { rows } = await postgres.query(`SELECT * FROM Users WHERE user_id='${id}'`);
    if (rows.length < 1) {
      const createUser = await postgres.query(`
        INSERT INTO Users (user_id, email, avatar, first_name, last_name)
        VALUES ('${id}', '${email}', '${picture}', '${given_name}', '${family_name}')
        RETURNING *
      `);
      console.log("user doesn't exist. create one");
      callback(null, createUser.rows[0]);
    } else {
      console.log("user exists");
      callback(null, rows[0]);
    }
  } catch(error) {
    callback(error);
  }
}

async function serializeUser(payload, callback) {
  try {
    const { user_id } = payload;
    console.log("serializeUser", user_id);
    callback(null, user_id);
  } catch(error) {
    callback(error);
  }
}

async function deserializeUser(id, callback) {
  try {
    console.log("deserializeUser");
    console.log("id", id);
    const user = await postgres.query(`select * from users where user_id='${id}'`);
    if (user.rows) {
      console.log(user.rows[0]);
      callback(null, user.rows[0]);
    }
  } catch(error) {
    callback(error);
  }
}

module.exports = {
  createUser,
  serializeUser,
  deserializeUser
}