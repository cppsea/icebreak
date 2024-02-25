const jwt = require("jsonwebtoken");
const UserController = require("../controllers/users");
const { hash } = require("bcrypt");


function generateRefreshToken(user) {
  const { userId } = user;
  return jwt.sign(
    {
      userId,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

function generateAccessToken(user) {
  const { userId, firstName, lastName, avatar, email } = user;
  return jwt.sign(
    {
      userId,
      firstName,
      lastName,
      avatar,
      email,
    },
    process.env.WEB_CLIENT_SECRET,
    {
      expiresIn: "1h",
    }
  );
}

// based off of this stackoverflow post:
// https://stackoverflow.com/questions/50916619/password-reset-with-jwt-structure
function generateResetPasswordToken(user) {
  const { userId } = user;
  const currentPasswordHash = UserController.getUser(userId).password;

  return jwt.sign(
    {
      sub: userId,
      purpose: "password_reset",
      key: hash(currentPasswordHash),
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
}


function verifyRefreshToken(refreshToken) {
  return jwt.verify(refreshToken, process.env.TOKEN_SECRET);
}

function verifyAccessToken(accessToken) {
  return jwt.verify(
    accessToken,
    process.env.WEB_CLIENT_SECRET,
    function (err, decoded) {
      if (err) {
        throw err;
      } else {
        // Token is valid
        // Return the payload of the access token
        return decoded;
      }
    }
  );
}

function verifyPasswordResetToken(passwordResetToken) {
  return jwt.verify(passwordResetToken, process.env.TOKEN_SECRET);
}

module.exports = {
  generateRefreshToken,
  generateAccessToken,
  generateResetPasswordToken,
  verifyRefreshToken,
  verifyAccessToken,
  verifyPasswordResetToken,
};
