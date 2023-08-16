const mongoose = require("mongoose");

async function cononectToDb() {
  dbName = "task-manager-data";
  dbURL = "mongodb://127.0.0.1:27017/" + dbName;

  try {
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongodb connected!");
  } catch (e) {
    console.log("Mongodb didn't connect! " + e);
  }
}

module.exports = cononectToDb;
