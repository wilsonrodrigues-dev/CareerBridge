const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");

const  {applyToDrive,getApplicantsByDrive,updateApplicationStatus,getApplicationsStats}  = require("../controllers/applicationcontroller");

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

router.get("/stats/applications",  authMiddleware,
  roleMiddleware("placementOfficer"), getApplicationsStats);


module.exports = router;