const express = require("express");
const { Tasks } = require("../db/models");
const router = new express.Router();

router.post("/tasks", (req, res) => {
  const task = new Tasks(req.body);
  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get("/tasks", (req, res) => {
  Tasks.find({})
    .then((tasks) => {
      res.send(tasks);
    })
    .catch((err) => {
      req.status(500).send(err);
    });
});

router.get("/tasks/:id", (req, res) => {
  Tasks.find({})
    .then((task) => {
      if (!task) {
        res.status(404).send("No Task Found");
      }
      res.send(task);
    })
    .catch((err) => {
      req.status(500).send(err);
    });
});

router.patch("/tasks/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Tasks.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      res.status(400).send("Task not found");
    }

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Tasks.findByIdAndDelete(_id);
    if (!task) {
      res.status(400).send("Task not found");
    }

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
