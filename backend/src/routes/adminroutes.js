const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");
const {getAdminStats,getStudentsAtRisk}  = require("../controllers/admincontroller");

router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("placementOfficer"),
  getAdminStats
);

router.get(
  "/students-at-risk",
  authMiddleware,
  roleMiddleware("placementOfficer"),
  getStudentsAtRisk
);

module.exports = router;