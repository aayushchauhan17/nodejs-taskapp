const jwt = require("jsonwebtoken");
const { Users } = require("../db/models");

async function authToken(req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodeToken = jwt.verify(token, "password");
    const user = await Users.findOne({
      _id: decodeToken._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(401).send("Please authorised");
  }
}

module.exports = { authToken };
