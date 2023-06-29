const jwt = require("jsonwebtoken");

function generateRefreshToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

function generateAccessToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      joined_date: user.joined_date,
      last_login: user.last_login,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
    },
    process.env.WEB_CLIENT_SECRET,
    {
      expiresIn: "1h",
    }
  );
}

function verifyRefreshToken(refreshToken) {
  return jwt.verify(refreshToken, process.env.TOKEN_SECRET, {
    algorithms: ["HS256"],
  });
}

function verifyAccessToken(accessToken, response, next) {
  jwt.verify(
    accessToken,
    process.env.WEB_CLIENT_SECRET,
    function (err, decoded) {
      if (err) {
        if (err.name === "TokenExpiredError") {
          // Token has expired
          response.status(401).json({
            error: "Access token has expired",
          });
        } else {
          // Other token verification errors
          response.status(401).json({
            error: "Invalid access token",
          });
        }
      } else {
        // Token is valid
        response.user = decoded;
        // Return the payload of the access token
        response.status(200).json(decoded);
        next();
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
