const User = require("../models/user.model");
const SkillBenchmark = require("../models/skillbenchmark");

exports.getSkillGap = async (req, res) => {
  try {
    const { roleName } = req.params;

    // 1️⃣ Get student
    const student = await User.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2️⃣ Get benchmark
    const benchmark = await SkillBenchmark.findOne({ roleName });

    if (!benchmark) {
      return res.status(404).json({ message: "Benchmark not found" });
    }

    const studentSkills = student.skills || [];
    const requiredSkills = benchmark.requiredSkills || [];

    // 3️⃣ Compare skills
    const matchedSkills = requiredSkills.filter(skill =>
      studentSkills.includes(skill)
    );

    const missingSkills = requiredSkills.filter(skill =>
      !studentSkills.includes(skill)
    );

    const matchPercentage =
      requiredSkills.length > 0
        ? ((matchedSkills.length / requiredSkills.length) * 100).toFixed(2)
        : 0;

    res.json({
      role: roleName,
      matchedSkills,
      missingSkills,
      matchPercentage
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};