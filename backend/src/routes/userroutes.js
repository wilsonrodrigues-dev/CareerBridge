const express = require("express");
const userrouter = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");
const { completeProfile } = require("../controllers/usercontroller");

userrouter.put(
  "/complete-profile",
  authMiddleware,
  roleMiddleware("student"),
  completeProfile,
);

module.exports = userrouter;
