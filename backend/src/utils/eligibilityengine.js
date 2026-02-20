const User = require("../models/user.model");

const getEligibleStudents = async (drive) => {
  const students = await User.find({
    role: "student",
    profileCompleted: true,
    "academicInfo.cgpa": { $gte: drive.criteria.minCgpa },
    "academicInfo.branch": { $in: drive.criteria.allowedBranches },
    "academicInfo.backlogs": { $lte: drive.criteria.maxBacklogs }
  });

  return students;
};

module.exports = getEligibleStudents;