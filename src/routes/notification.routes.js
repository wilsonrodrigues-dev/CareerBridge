const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");

const {
  getMyNotifications,
  markAsRead
} = require("../controllers/notificationcontroller");

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("student"),
  getMyNotifications
);

router.put(
  "/read/:id",
  authMiddleware,
  roleMiddleware("student"),
  markAsRead
);

module.exports = router;