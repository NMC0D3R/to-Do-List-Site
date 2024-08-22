const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");

const express = require("express");
const router = express.Router();

router
  .route("/createTask")
  .post(authController.protect, taskController.createTask);
router
  .route("/getTasksByUser")
  .get(authController.protect, taskController.getTasksByUser);
router
  .route("/deleteTask/:id")
  .delete(authController.protect, taskController.deleteTask);
router
  .route("/clearAllTasks")
  .get(authController.protect, taskController.clearAllTasks);

router.route("/:id").patch(authController.protect, taskController.editTaskById);

router.route("/patchTask/:id").patch(taskController.patchTask);

module.exports = router;
