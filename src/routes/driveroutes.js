const express = require("express");
const driveroutes = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");
const { createDrive, getEligibleDrives,getAllDrives } = require("../controllers/drivecontroller");

driveroutes.post(
  "/create",
  authMiddleware,
  roleMiddleware("placementOfficer"),
  createDrive
);

driveroutes.get(
  "/eligible",
  authMiddleware,
  roleMiddleware("student"),
  getEligibleDrives
);

driveroutes.get(
  "/all",
  authMiddleware,
  roleMiddleware("placementOfficer"),
  getAllDrives
);

module.exports = driveroutes;