const bycrypt = require("bcryptjs");

async function getHashPassword(pass) {
  const hashPass = await bycrypt.hash(pass, 8);

  return hashPass;
}

async function matchHashPassword(pass, hashpass) {
  const isMatch = await bycrypt.compare(pass, hashpass);

  return isMatch;
}

module.exports = { getHashPassword, matchHashPassword };
