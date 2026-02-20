const applicationmodel = require("../models/application.model");
const Drive = require("../models/drive.model");

const applyToDrive = async (req, res) => {
  try {
    const { driveId } = req.params;

    // Check if drive exists
    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }
    // 🔥 Deadline check
    if (new Date() > new Date(drive.deadline)) {
      return res
        .status(400)
        .json({ message: "Drive application deadline passed" });
    }

    // Prevent duplicate application
    const existing = await applicationmodel.findOne({
      student: req.user.id,
      drive: driveId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await applicationmodel.create({
      student: req.user.id,
      drive: driveId,
    });

    res.json({
      message: "Applied successfully",
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getApplicantsByDrive = async (req, res) => {
  try {
    const { driveId } = req.params;

    const applications = await applicationmodel
      .find({ drive: driveId })
      .populate("student", "name email academicInfo placementStatus");

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    if (!req.body || !req.body.status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const { applicationId } = req.params;
    const { status } = req.body;

    const updated = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true },
    );

    // 🔥 Smart Logic
    if (status === "Selected") {
      await User.findByIdAndUpdate(updated.student, {
        placementStatus: "Placed",
      });
    }

    res.json({
      message: "Status updated successfully",
      updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  applyToDrive,
  getApplicantsByDrive,
  updateApplicationStatus,
};
