const express = require("express");
const { Users } = require("../db/models");
const { getHashPassword, matchHashPassword } = require("../common.js");
const router = new express.Router();

router.post("/users", async (req, res) => {
  let { password, ...userData } = req.body;
  const hashPass = await getHashPassword(password);
  userData = { ...userData, password: hashPass };
  console.log(userData);
  const user = new Users(userData);
  // console.log(user);
  try {
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

    console.log(user);

    if (user) {
      const isPassMatch = await matchHashPassword(
        req.body.password,
        user.password
      );

      isPassMatch
        ? res.send("Successfully Login")
        : res.status(400).send("Wrong Password");
    } else {
      res.status(400).send("User Not Found");
    }
  } catch (e) {
    res.send(e);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await Users.find({});
    res.send(users);
  } catch (e) {
    req.status(500).send(e);
  }
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
    req.status(500).send(err);
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
