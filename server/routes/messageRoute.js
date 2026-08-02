const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedin");

const {
  getMessages,
} = require("../controllers/messageController");

router.get("/:taskId", isLoggedIn, getMessages);

module.exports = router;