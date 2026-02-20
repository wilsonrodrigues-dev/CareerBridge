const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");

const {
  createBenchmark,
  getAllBenchmarks,
  updateBenchmark,
  deleteBenchmark
} = require("../controllers/benckmarkcontroller");

// Only placement officer
router.post(
  "/",
  authMiddleware,
  roleMiddleware("placementOfficer"),
  createBenchmark
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("placementOfficer"),
  getAllBenchmarks
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("placementOfficer"),
  updateBenchmark
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("placementOfficer"),
  deleteBenchmark
);

module.exports = router;