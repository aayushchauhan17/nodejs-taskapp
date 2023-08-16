const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function getHashPassword(pass) {
  const hashPass = await bycrypt.hash(pass, 8);

  return hashPass;
}

async function matchHashPassword(pass, hashpass) {
  const isMatch = await bycrypt.compare(pass, hashpass);

  return isMatch;
}

async function generateToken(id) {
  const token = jwt.sign({ _id: id.toString() }, "password", {
    expiresIn: "7 days",
  });

  return token;
}

module.exports = { getHashPassword, matchHashPassword, generateToken };
