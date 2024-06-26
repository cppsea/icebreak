const { OAuth2Client } = require("google-auth-library");
const { v5: uuidv5, v4: uuidv4 } = require("uuid");
const prisma = require("../prisma/prisma");
const token = require("../utils/token");
const bcrypt = require("bcrypt");
const client = new OAuth2Client(process.env.WEB_CLIENT_ID);
const nodemailer = require("nodemailer");

const NAMESPACE = "7af17462-8078-4703-adda-be2143a4d93a";

async function create(accessToken, refreshToken, profile, callback) {
  try {
    let { sub, given_name, family_name, picture, email } = profile._json;
    picture = picture.replace("=s96-c", "");
    const googleUUID = uuidv5(sub, NAMESPACE);
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        userId: googleUUID,
      },
    });
    if (!user) {
      const newUser = await prisma.user.create({
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

  // generate Type 5 UUIDs with hashes of user's google account IDs instead of
  // completely random Type 4 UUIDs to keep UUIDs unique regardless of google or
  // local authentication
  const googleUUID = uuidv5(sub, NAMESPACE);
  const user = await prisma.user.findUnique({
    where: {
      userId: googleUUID,
    },
  });

  // if the query returns a row, there's a user with the existing userId.
  if (!user) {
    const newUser = await prisma.user.create({
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

async function register(newUser) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(newUser.password, salt);
  const userId = uuidv4();

  // placeholder names until new user puts in their names in onboarding screen
  return await prisma.user.create({
    data: {
      userId,
      firstName: "New",
      lastName: "User",
      email: newUser.email,
      password: passwordHash,
    },
  });
}

async function login(request, response, next) {
  const provider = request.url.slice(1);

  switch (provider) {
    case "google":
      if (!request.body.token) {
        return response.status(400).json({
          status: "fail",
          data: {
            token: "Token not provided",
          },
        });
      }

      try {
        const user = await authenticateWithGoogle(request.body.token);
        request.user = user;
        next();
      } catch (err) {
        return response.status(500).json({
          status: "error",
          message: err.message,
        });
      }
      break;
    default:
      return response.status(500).json({
        status: "error",
        message: "Unsupported authentication provider",
      });
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
    const user = await prisma.user.findUniqueOrThrow({
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

  if (!authToken) {
    return response.status(400).json({
      status: "fail",
      data: {
        Authorization: "Token not provided",
      },
    });
  }

  try {
    request.user = token.verifyAccessToken(authToken);
    next();
  } catch (error) {
    // Handle any errors that occur during token verification
    switch (error.name) {
      case "TokenExpiredError":
        return response.status(401).json({
          status: "fail",
          data: {
            accessToken: "Token expired",
          },
        });
      default:
        return response.status(500).json({
          status: "error",
          message: error.message,
        });
    }
  }
}

async function isUserEmail(email) {
  const result = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (result === null) return false;

  return true;
}

async function isGoogleAccount(userId) {
  const result = await prisma.user.findUnique({
    where: {
      userId: userId,
    },
  });

  if (result.password == null) return true;

  return false;
}

async function sendEmail(address, subject, body) {
  const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: "icebreak@cppicebreak.com",
      pass: process.env.MAILBOX_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: "icebreak@cppicebreak.com",
    to: address,
    subject: subject,
    text: body,
  });

  return info;
}

async function sendPasswordResetEmail(address, passwordResetToken) {
  const subject = "Icebreak: Password Reset Request";
  const baseUrl = process.env.BASE_URL || "http://localhost:5050"; // Note: If the .env file does not contain BASE_URL, it will default to localhost:5050
  const link = `${baseUrl}/api/auth/reset-password?token=${passwordResetToken}`;
  const body = `Please click the following link to reset your password: ${link}`;

  return sendEmail(address, subject, body);
}

async function sendPasswordResetConfirmationEmail(address) {
  const subject = "Icebreak: Password Reset";
  const body =
    "Your Icebreak password has been changed. If you did not request a password change, please immediately contact us at icebreak@cppicebreak.com.";

  return sendEmail(address, subject, body);
}

async function resetPassword(userId, password) {
  // Encrypt the password with the method used for registering
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPass = await bcrypt.hash(password, salt);

  // Update the db with the new encryped password
  return await prisma.user.update({
    where: {
      userId: userId,
    },
    data: {
      password: hashedPass,
    },
  });
}

module.exports = {
  create,
  login,
  register,
  serialize,
  deserialize,
  authenticate,
  authenticateWithGoogle,
  isUserEmail,
  isGoogleAccount,
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
  resetPassword,
};
