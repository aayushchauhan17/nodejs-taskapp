const express = require("express");
const cononectToDb = require("./src/db/mongoose");
const userRoutes = require("./src/routes/users");
const tasksRoutes = require("./src/routes/tasks");

const app = express();
const port = process.env.PORT || 3000;

//connection to DB
cononectToDb();

app.use(express.json());

app.use(userRoutes);
app.use(tasksRoutes);

app.listen(port, () => {
  console.log("Server got connected with port : " + port);
});
