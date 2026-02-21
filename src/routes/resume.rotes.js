// const express = require("express");
// const router = express.Router();

// const authMiddleware = require("../middleware/authmiddleware");
// const roleMiddleware = require("../middleware/rolemiddleware");

// const { getResumeData } = require("../controllers/resume.controller");

// router.get(
//   "/data",
//   authMiddleware,
//   roleMiddleware("student"),
//   getResumeData
// );

// module.exports = router;




const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");

const { generateResume } = require("../controllers/resume.controller");

router.post(
  "/generate",
  authMiddleware,
  roleMiddleware("student"),
  generateResume
);

module.exports = router;