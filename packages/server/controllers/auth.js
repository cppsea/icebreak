const { OAuth2Client } = require("google-auth-library");
const { v5: uuidv5 } = require("uuid");
const postgres = require("../utils/postgres");
const prisma = require("../utils/prisma");
const token = require("../utils/token");
const client = new OAuth2Client(process.env.WEB_CLIENT_ID);

const NAMESPACE = "7af17462-8078-4703-adda-be2143a4d93a";

async function create(accessToken, refreshToken, profile, callback) {
  try {
    let { sub, given_name, family_name, picture, email } = profile._json;
    picture = picture.replace("=s96-c", "");
    const googleUUID = uuidv5(sub, NAMESPACE);
    // const { rows } = await postgres.query(`SELECT * FROM Users WHERE user_id='${googleUUID}'`);
    const user = await prisma.users.findUniqueOrThrow({
      where: {
        userId: id,
      },
    });
    // if (rows.length < 1) {
    if (!user) {
      // const createUser = await postgres.query(`
      //   INSERT INTO Users (user_id, email, avatar, first_name, last_name)
      //   VALUES ('${googleUUID}', '${email}', '${picture}', '${given_name}', '${family_name}')
      //   RETURNING *
      // `);
      const newUser = await prisma.users.create({
        data: {
          userId: id,
          email: email,
          avatar: picture,
          firstName: given_name,
          lastName: family_name,
        },
      });
      console.log("user doesn't exist. create one");
      // callback(null, createUser.rows[0]);
      callback(null, newUser);
    } else {
      console.log("user exists");
      // callback(null, rows[0]);
      callback(null, user);
    }
  } catch (error) {
    callback(error);
  }
}

async function authenticateWithGoogle(token) {
  // Verify the token is valid; to ensure it's a valid google auth.
  const { payload } = await client.verifyIdToken({
    idToken: token,
    audience: process.env.WEB_CLIENT_ID,
  });

  // Check if this user already exist on our database.
  const { sub, email, given_name, family_name, picture } = payload;
  const googleUUID = uuidv5(sub, NAMESPACE);
  console.log("@payload", payload);
  // const { rows } = await postgres.query(
  //   `SELECT * FROM Users WHERE user_id='${googleUUID}'`
  // );
  const user = await prisma.users.findUnique({
    where: {
      userId: id,
    },
  });

  // if the query returns a row, there's a user with the existing userId.
  // if (rows.length < 1) {
  if (!user) {
    // const createUser = await postgres.query(`
    //   INSERT INTO Users (user_id, email, avatar, first_name, last_name)
    //   VALUES ('${googleUUID}', '${email}', '${picture}', '${given_name}', '${family_name}')
    //   RETURNING *
    // `);

    const newUser = await prisma.users.create({
      data: {
        userId: id,
        email: email,
        avatar: picture,
        firstName: given_name,
        lastName: family_name,
      },
    });

    // return createUser.rows[0];
    return newUser;
  } else {
    // return rows[0];
    return user;
  }
}

async function login(request, response, next) {
  const provider = request.url.slice(1);
  const { token } = request.body;

  switch (provider) {
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
  } catch (error) {
    callback(error);
  }
}

async function deserialize(id, callback) {
  try {
    console.log("deserializeUser");
    console.log("id", id);
    // const user = await postgres.query(
    //   `select * from users where user_id='${id}'`
    // );
    const user = await prisma.users.findUniqueOrThrow({
      where: {
        userId: id,
      },
    });
    // if (user.rows) {
    if (user) {
      // console.log(user.rows[0]);
      // callback(null, user.rows[0]);
      console.log(user);
      callback(null, user);
    }
  } catch (error) {
    callback(error);
  }
}

async function authenticate(request, response, next) {
  const authToken = request.get("Authorization");
  const payload = token.verify(authToken);
  request.user = payload;
  next();
}

module.exports = {
  create,
  login,
  serialize,
  deserialize,
  authenticate,
  authenticateWithGoogle,
};
