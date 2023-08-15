const jwt = require("jsonwebtoken");

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

module.exports = {
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken,
  verifyAccessToken,
};
