const jwt = require("jsonwebtoken");

function generate(user) {
  return jwt.sign(user, process.env.TOKEN_SECRET, {
    expiresIn: '1d'
  });
}

function verify(token) {
  return jwt.verify(token, process.env.TOKEN_SECRET);
}

module.exports = {
  generate,
  verify
}