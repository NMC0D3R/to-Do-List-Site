const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const express = require("express");
const router = express.Router();

router.route("/register").post(authController.createUser);
router.route("/login").post(authController.login);
router.route("/logOut").get(authController.logOut);
router.route("/:id").get(userController.getUserById);

router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:plainResetToken", authController.resetPassword);

module.exports = router;
