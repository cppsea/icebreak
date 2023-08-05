const { OAuth2Client } = require("google-auth-library");
const { v5: uuidv5 } = require("uuid");
const prisma = require("../prisma/prisma");
const token = require("../utils/token");
const client = new OAuth2Client(process.env.WEB_CLIENT_ID);

const NAMESPACE = "7af17462-8078-4703-adda-be2143a4d93a";

async function create(accessToken, refreshToken, profile, callback) {
  try {
    let { sub, given_name, family_name, picture, email } = profile._json;
    picture = picture.replace("=s96-c", "");
    const googleUUID = uuidv5(sub, NAMESPACE);
    const user = await prisma.users.findUniqueOrThrow({
      where: {
        userId: googleUUID,
      },
    });
    if (!user) {
      const newUser = await prisma.users.create({
        data: {
          userId: googleUUID,
          email: email,
          avatar: picture,
          firstName: given_name,
          lastName: family_name,
        },
      });
      console.log("user doesn't exist. create one");
      callback(null, newUser);
    } else {
      console.log("user exists");
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
  const user = await prisma.users.findUnique({
    where: {
      userId: googleUUID,
    },
  });

  // if the query returns a row, there's a user with the existing userId.
  if (!user) {
    const newUser = await prisma.users.create({
      data: {
        userId: googleUUID,
        email: email,
        avatar: picture,
        firstName: given_name,
        lastName: family_name,
      },
    });

    return newUser;
  } else {
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
    const user = await prisma.users.findUniqueOrThrow({
      where: {
        userId: id,
      },
    });
    if (user) {
      console.log(user);
      callback(null, user);
    }
  } catch (error) {
    callback(error);
  }
}

async function authenticate(request, response, next) {
  const authToken = request.get("Authorization");

  try {
    request.user = token.verifyAccessToken(authToken);
    next();
  } catch (error) {
    // Handle any errors that occur during token verification
    response.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

module.exports = {
  create,
  login,
  serialize,
  deserialize,
  authenticate,
  authenticateWithGoogle,
};
