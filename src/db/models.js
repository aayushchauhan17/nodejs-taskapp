const mongoose = require("mongoose");
const { default: isEmail } = require("validator/lib/isEmail");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!isEmail(value)) {
        throw new Error("Email should be correct");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age should be positive.!");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
});

const TaskSchema = new mongoose.Schema({
  discriptation: {
    type: String,
    required: true,
    trim: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Users = mongoose.model("users", UserSchema);
const Tasks = mongoose.model("tasks", TaskSchema);

module.exports = { Users, Tasks };
