const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");

const  {applyToDrive,getApplicantsByDrive,updateApplicationStatus}  = require("../controllers/applicationcontroller");

router.post(
  "/apply/:driveId",
  authMiddleware,
  roleMiddleware("student"),
  applyToDrive
);

router.get(
  "/drive/:driveId",
  authMiddleware,
  roleMiddleware("placementOfficer"),
  getApplicantsByDrive
);

router.put(
  "/status/:applicationId",
  authMiddleware,
  roleMiddleware("placementOfficer"),
  updateApplicationStatus
);


module.exports = router;