const express = require("express");
const passport = require("../config/passport");

const router = express.Router();

const { signup } = require("../controllers/userController");
const { login } = require("../controllers/authController");

router.post("/signup", signup);

router.post(
  "/login",
  passport.authenticate("local"),
  login
);

module.exports = router;