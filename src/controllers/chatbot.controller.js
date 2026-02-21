const User = require("../models/user.model");
const Drive = require("../models/drive.model");
const SkillBenchmark = require("../models/skillbenchmark");

/* ===============================
   🧠 Intent Dictionary
================================ */
const intents = {
  greeting: ["hi", "hello", "hey"],
  eligibility: ["eligible", "can i apply", "apply for", "am i eligible"],
  skillGap: ["skill", "gap", "missing", "improve"],
  drives: ["drive", "companies", "openings"],
  risk: ["risk", "placement risk", "danger"]
};

function detectIntent(message) {
  for (const intent in intents) {
    if (intents[intent].some(keyword => message.includes(keyword))) {
      return intent;
    }
  }
  return "unknown";
}

/* ===============================
   🎭 Random Response Helper
================================ */
function randomResponse(options) {
  return options[Math.floor(Math.random() * options.length)];
}

/* ===============================
   🧠 Role Extraction
================================ */
async function extractRole(message) {
  const benchmarks = await SkillBenchmark.find();
  for (const benchmark of benchmarks) {
    if (message.includes(benchmark.roleName.toLowerCase())) {
      return benchmark.roleName;
    }
  }
  return null;
}

/* ===============================
   💡 Advisory Generator
================================ */
function generateAdvice({ cgpa, riskScore, matchPercentage }) {
  let advice = [];

  if (cgpa < 6.5) {
    advice.push("Focus on improving your academic consistency.");
  }

  if (matchPercentage !== undefined && matchPercentage < 50) {
    advice.push("Strengthen your core technical skills.");
  }

  if (riskScore > 60) {
    advice.push("Consider applying to more drives and upskilling urgently.");
  }

  return advice.join(" ");
}

/* ===============================
   🤖 Main Chat Controller
================================ */
exports.chat = async (req, res) => {
  try {
    const message = req.body.message?.toLowerCase();
    const userId = req.user.id;

    if (!message) {
      return res.json({ reply: "Please type a message." });
    }

    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({ reply: "Student not found." });
    }

    const intent = detectIntent(message);

    /* ===============================
       👋 Greeting
    ================================= */
    if (intent === "greeting") {
      return res.json({
        reply: `Hi ${student.name}! 👋 I'm your Placement Assistant. You can ask me about eligibility, skill gaps, active drives, or your risk score.`
      });
    }

    /* ===============================
       🎯 Eligibility
    ================================= */
    if (intent === "eligibility") {
      const drives = await Drive.find({ status: "Active" });

      const eligibleDrives = drives.filter(drive => {
        const criteria = drive.criteria;

        return (
          student.academicInfo.cgpa >= criteria.minCgpa &&
          criteria.allowedBranches.includes(student.academicInfo.branch) &&
          student.academicInfo.backlogs <= criteria.maxBacklogs
        );
      });

      if (!eligibleDrives.length) {
        return res.json({
          reply: "Currently, you are not eligible for any active drives. Consider improving your academic or skill profile."
        });
      }

      const driveList = eligibleDrives.map(d => d.companyName).join(", ");

      return res.json({
        reply: randomResponse([
          `Great news! You qualify for ${eligibleDrives.length} drives: ${driveList}.`,
          `Awesome! Based on your profile, you're eligible for: ${driveList}.`,
          `Good job! You can apply to these drives: ${driveList}.`
        ])
      });
    }

    /* ===============================
       🧠 Skill Gap
    ================================= */
    if (intent === "skillGap") {
      const role = await extractRole(message);
      const benchmark = role
        ? await SkillBenchmark.findOne({ roleName: role })
        : await SkillBenchmark.findOne(); // fallback

      if (!benchmark) {
        return res.json({ reply: "No skill benchmarks available yet." });
      }

      const required = benchmark.requiredSkills;
      const studentSkills = student.skills || [];

      const matched = required.filter(skill =>
        studentSkills.includes(skill)
      );

      const missing = required.filter(skill =>
        !studentSkills.includes(skill)
      );

      const matchPercentage =
        required.length > 0
          ? (matched.length / required.length) * 100
          : 0;

      const advice = generateAdvice({
        cgpa: student.academicInfo.cgpa,
        matchPercentage,
        riskScore: 0
      });

      return res.json({
        reply: `For the role ${benchmark.roleName}, your skill match is ${matchPercentage.toFixed(
          2
        )}%. Missing skills: ${missing.join(", ") || "None"}. ${advice}`
      });
    }

    /* ===============================
       📊 Active Drives
    ================================= */
    if (intent === "drives") {
      const drives = await Drive.find({ status: "Active" });

      if (!drives.length) {
        return res.json({
          reply: "There are currently no active drives."
        });
      }

      const list = drives.map(d => `${d.companyName} (${d.role})`).join(", ");

      return res.json({
        reply: `There are ${drives.length} active drives: ${list}.`
      });
    }

    /* ===============================
       ⚠ Risk Score
    ================================= */
    if (intent === "risk") {
      let risk = 0;

      if (student.academicInfo.cgpa < 6.5) risk += 30;
      if (student.academicInfo.backlogs > 0) risk += 25;
      if (student.placementStatus === "Not Placed") risk += 15;

      const advice = generateAdvice({
        cgpa: student.academicInfo.cgpa,
        riskScore: risk
      });

      return res.json({
        reply: `Your current placement risk score is ${risk}/100. ${advice}`
      });
    }

    /* ===============================
       🤖 Default Response
    ================================= */
    return res.json({
      reply:
        "I can help you with eligibility, skill gaps, active drives, and placement risk. Try asking about them!"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Something went wrong." });
  }
};




// const User = require("../models/user.model");
// const Drive = require("../models/drive.model");
// const SkillBenchmark = require("../models/skillbenchmark");

// exports.chat = async (req, res) => {
//   try {
//     const message = req.body.message?.toLowerCase();
//     const userId = req.user.id;

//     if (!message) {
//       return res.json({ reply: "Please type a message." });
//     }

//     // 🔹 Fetch student
//     const student = await User.findById(userId);
//     if (!student) {
//       return res.status(404).json({ reply: "Student not found." });
//     }

//     // =========================
//     // 1️⃣ ELIGIBILITY CHECK
//     // =========================
//     if (message.includes("eligible")) {
//       const drives = await Drive.find({ status: "Active" });

//       const eligibleDrives = drives.filter(drive => {
//         const criteria = drive.criteria;

//         return (
//           student.academicInfo.cgpa >= criteria.minCgpa &&
//           criteria.allowedBranches.includes(student.academicInfo.branch) &&
//           student.academicInfo.backlogs <= criteria.maxBacklogs
//         );
//       });

//       if (eligibleDrives.length === 0) {
//         return res.json({
//           reply: "Currently, you are not eligible for any active drives."
//         });
//       }

//       const driveList = eligibleDrives.map(d => d.companyName).join(", ");

//       return res.json({
//         reply: `Good news! You are eligible for ${eligibleDrives.length} drives: ${driveList}.`
//       });
//     }

//     // =========================
//     // 2️⃣ SKILL GAP CHECK
//     // =========================
//     if (message.includes("skill")) {
//       const benchmarks = await SkillBenchmark.find();

//       if (!benchmarks.length) {
//         return res.json({ reply: "No skill benchmarks available yet." });
//       }

//       const benchmark = benchmarks[0]; // simple default for now
//       const required = benchmark.requiredSkills;
//       const studentSkills = student.skills || [];

//       const missing = required.filter(skill => !studentSkills.includes(skill));
//       const match = ((required.length - missing.length) / required.length) * 100;

//       return res.json({
//         reply: `For the role ${benchmark.roleName}, your skill match is ${match.toFixed(
//           2
//         )}%. You are missing: ${missing.join(", ") || "No major gaps."}`
//       });
//     }

//     // =========================
//     // 3️⃣ ACTIVE DRIVES
//     // =========================
//     if (message.includes("drive")) {
//       const drives = await Drive.find({ status: "Active" });

//       if (!drives.length) {
//         return res.json({ reply: "There are currently no active drives." });
//       }

//       const list = drives.map(d => `${d.companyName} (${d.role})`).join(", ");

//       return res.json({
//         reply: `There are ${drives.length} active drives: ${list}.`
//       });
//     }

//     // =========================
//     // 4️⃣ RISK SCORE
//     // =========================
//     if (message.includes("risk")) {
//       let risk = 0;

//       if (student.academicInfo.cgpa < 6.5) risk += 30;
//       if (student.academicInfo.backlogs > 0) risk += 25;
//       if (student.placementStatus === "Not Placed") risk += 15;

//       return res.json({
//         reply: `Your current placement risk score is ${risk}/100. Focus on improving skills and academics.`
//       });
//     }

//     // =========================
//     // DEFAULT RESPONSE
//     // =========================
//     return res.json({
//       reply:
//         "I can help you with eligibility, skill gaps, active drives, and risk score. Try asking about them!"
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ reply: "Something went wrong." });
//   }
// };




