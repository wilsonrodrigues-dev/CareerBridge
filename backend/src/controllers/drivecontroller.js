const Drive = require("../models/drive.model");
const User = require("../models/user.model");
const getEligibleStudents = require("../utils/eligibilityengine");
const Notification = require("../models/notification.model");
const ActivityLog = require("../models/activitylog.model");
const Application = require("../models/application.model");

//crerating the drive with emailfor eligible students
const createDrive = async (req, res) => {
  try {
    const drive = await Drive.create(req.body);

    // 1️⃣ Find eligible students
    const eligibleStudents = await User.find({
      role: "student",
      profileCompleted: true,
      placementStatus: "Not Placed",
      "academicInfo.cgpa": { $gte: drive.criteria.minCgpa },
      "academicInfo.branch": { $in: drive.criteria.allowedBranches },
      "academicInfo.backlogs": { $lte: drive.criteria.maxBacklogs },
    });

    drive.eligibleStudents = eligibleStudents.map((s) => s._id);
    await drive.save();

    // 2️⃣ Create notifications for each eligible student
    const notifications = eligibleStudents.map((student) => ({
      user: student._id,
      title: `New Drive: ${drive.companyName}`,
      message: `You are eligible for ${drive.role}. Apply before ${drive.deadline}`,
    }));

    await Notification.insertMany(notifications);

    // 3️⃣ Log activity
    await ActivityLog.create({
      action: `${drive.companyName} drive created. ${eligibleStudents.length} students eligible.`,
      performedBy: req.user.id,
    });

    res.json({
      message: "Drive created and notifications sent",
      eligibleCount: eligibleStudents.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//getting the eligible drives for user
const getEligibleDrives = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const eligibleDrives = await Drive.find({
      status: "Active",
      "criteria.minCgpa": { $lte: user.academicInfo.cgpa },
      "criteria.allowedBranches": user.academicInfo.branch,
      "criteria.maxBacklogs": { $gte: user.academicInfo.backlogs }
    });

    res.json(eligibleDrives);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllDrives = async (req, res) => {
  try {
    const drives = await Drive.find().sort({ createdAt: -1 });

    const drivesWithApplicantCount = await Promise.all(
      drives.map(async (drive) => {
        const count = await Application.countDocuments({
          drive: drive._id
        });

        return {
          ...drive._doc,
          applicantCount: count
        };
      })
    );

    res.json(drivesWithApplicantCount);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createDrive,
  getEligibleDrives,getAllDrives
};
