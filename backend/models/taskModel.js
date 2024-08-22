const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskTitle: {
      type: String,
      required: [true, "must type task"],
    },
    taskDescription: {
      type: String,
      required: [true, "type description"],
    },
    dueDate: {
      type: Date,
      // default: Date.now(),
    },
    taskPriority: {
      type: String,
      default: "green",
    },
    taskIsCompleted: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "must have a user"],
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
