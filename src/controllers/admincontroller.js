const User = require("../models/user.model");
const Drive = require("../models/drive.model");
const Application = require("../models/application.model");
const SkillBenchmark=require("../models/skillbenchmark")


const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });

    const totalPlaced = await User.countDocuments({
      role: "student",
      placementStatus: "Placed"
    });

    const totalDrives = await Drive.countDocuments();
    const activeDrives = await Drive.countDocuments({ status: "Active" });

    const totalApplications = await Application.countDocuments();

    const placementRate =
      totalStudents > 0
        ? ((totalPlaced / totalStudents) * 100).toFixed(2)
        : 0;

    res.json({
      totalStudents,
      totalPlaced,
      placementRate,
      totalDrives,
      activeDrives,
      totalApplications
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const getStudentsAtRisk = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
      placementStatus: "Not Placed"
    });

    const benchmarks = await SkillBenchmark.find();

    const result = [];

    for (const student of students) {
      let riskScore = 0;

      const cgpa = student.academicInfo?.cgpa || 0;
      const backlogs = student.academicInfo?.backlogs || 0;
      const studentSkills = student.skills || [];

      // 📉 CGPA Risk
      if (cgpa < 6.5) riskScore += 30;

      // 📚 Backlog Risk
      if (backlogs > 0) riskScore += 25;

      // 🧠 Skill Risk (average across all benchmarks)
      let avgMatch = 0;

      if (benchmarks.length > 0) {
        let totalMatch = 0;

        for (const benchmark of benchmarks) {
          const required = benchmark.requiredSkills;
          const matched = required.filter(skill =>
            studentSkills.includes(skill)
          );

          const matchPercent =
            required.length > 0
              ? (matched.length / required.length) * 100
              : 0;

          totalMatch += matchPercent;
        }

        avgMatch = totalMatch / benchmarks.length;
      }

      if (avgMatch < 50) riskScore += 30;

      // ❌ Placement Status Risk
      if (student.placementStatus === "Not Placed") riskScore += 15;

      result.push({
        name: student.name,
        email: student.email,
        cgpa,
        backlogs,
        skillMatchAverage: avgMatch.toFixed(2),
        riskScore
      });
    }

    // Sort highest risk first
    result.sort((a, b) => b.riskScore - a.riskScore);

    res.json({
      totalStudentsEvaluated: result.length,
      students: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports={getAdminStats,getStudentsAtRisk}