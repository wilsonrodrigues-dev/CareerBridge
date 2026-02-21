const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");

const { chat } = require("../controllers/chatbot.controller");

router.post(
  "/chat",
  authMiddleware,
  roleMiddleware("student"),
  chat
);

module.exports = router;