const User = require("../models/user.model");

exports.completeProfile = async (req, res) => {
  try {
    const { course, branch, cgpa, backlogs, skills } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        academicInfo: {
          course,
          branch,
          cgpa,
          backlogs
        },
        skills,
        profileCompleted: true
      },
      { new: true }
    );

    res.json({
      message: "Profile completed successfully",
      user: updatedUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};