const express = require("express");
const { Users } = require("../db/models");
const {
  getHashPassword,
  matchHashPassword,
  generateToken,
} = require("../common.js");
const { authToken } = require("../middleware/auth");
const router = new express.Router();

router.post("/users", async (req, res) => {
  let { password, ...userData } = req.body;
  try {
    const hashPass = await getHashPassword(password.toString());
    userData = { ...userData, password: hashPass };
    let user = new Users(userData);
    const usertoken = await generateToken(user._id);
    user.tokens = user.tokens.concat({ token: usertoken });

    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await Users.findOne({ email });

    if (user) {
      const isPassMatch = await matchHashPassword(
        req.body.password,
        user.password
      );

      if (isPassMatch) {
        const usertoken = await generateToken(user._id);
        updateData = user.tokens.concat({ token: usertoken });
        const userUpdated = await Users.findByIdAndUpdate(
          user._id,
          { tokens: updateData },
          {
            new: true,
          }
        );

        res.send({ data: userUpdated, token: usertoken });
      } else {
        res.status(400).send("Wrong Password");
      }
    } else {
      res.status(400).send("User Not Found");
    }
  } catch (e) {
    res.send(e);
  }
});

router.get("/users/me", authToken, async (req, res) => {
  res.send(req.user);
});

router.post("/users/logout", authToken, async (req, res) => {
  req.user.tokens = req.user.tokens.filter((tok) => {
    console.log(tok);
    return tok.token != req.token;
  });

  await req.user.save();

  res.send("Logout");
});

router.post("/users/logoutall", authToken, async (req, res) => {
  req.user.tokens = [];

  await req.user.save();

  res.send("Logout All");
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await Users.findById(_id);
    if (!user) {
      res.status(404).send("No user found");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/users/:id", async (req, res) => {
  const _id = req.params.id;
  let { password, ...updateData } = req.body;
  if (password) {
    const hashPass = await getHashPassword(password);
    updateData = { ...updateData, password: hashPass };
  }

  try {
    const user = await Users.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(400).send("user not found");
    }

    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await Users.findByIdAndDelete(_id);
    if (!user) {
      res.status(400).send("user not found");
    }

    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
