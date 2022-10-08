const { OAuth2Client } = require('google-auth-library');

const postgres = require("../utils/postgres");
const token = require("../utils/token");

const CLIENT_ID = '1080245081969-u9lnl9ospj757rq75kiumttqconhnfcc.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

async function create(accessToken, refreshToken, profile, callback) {
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

async function authenticateWithGoogle(token) {
  // Verify the token is valid; to ensure it's a valid google auth.
  const { payload } = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID
  });

  // Check if this user already exist on our database.
  const { sub: userId, email, given_name, family_name, picture } = payload;
  console.log("@payload", payload);
  const { rows } = await postgres.query(`SELECT * FROM Users WHERE user_id='${userId}'`);

  // if the query returns a row, there's a user with the existing userId.
  if (rows.length < 1) {
    const createUser = await postgres.query(`
      INSERT INTO Users (user_id, email, avatar, first_name, last_name)
      VALUES ('${userId}', '${email}', '${picture}', '${given_name}', '${family_name}')
      RETURNING *
    `);

    return createUser.rows[0];
  } else {
    return rows[0];
  }
}

async function login(request, response, next) {
  const provider = request.url.slice(1);
  const { token } = request.body;

  switch(provider) {
    case "google":
      request.user = await authenticateWithGoogle(token);
      next();
      break;
    case "facebook":
      break;
    case "apple":
      break;
    default:
      throw new Error("Unsupported Provider");
  }
}

async function serialize(payload, callback) {
  try {
    const { user_id } = payload;
    console.log("serializeUser", user_id);
    callback(null, user_id);
  } catch(error) {
    callback(error);
  }
}

async function deserialize(id, callback) {
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

async function authenticate(request, response, next) {
  const authToken = request.get("Authorization");
  console.log(authToken);
  const payload = token.verify(authToken);
  console.log(authToken);
  request.user = payload;
  next();
}

module.exports = {
  create,
  login,
  serialize,
  deserialize,
  authenticate,
  authenticateWithGoogle
}