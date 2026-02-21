const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");

const { getSkillGap } = require("../controllers/skillgap.controller");

router.get(
  "/:roleName",
  authMiddleware,
  roleMiddleware("student"),
  getSkillGap
);

module.exports = router;