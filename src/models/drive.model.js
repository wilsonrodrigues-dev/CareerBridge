const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema({
  companyName: String,
  role: String,

  criteria: {
    minCgpa: Number,
    allowedBranches: [String],
    maxBacklogs: Number,
  },
  eligibleStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  deadline: Date,

  status: {
    type: String,
    enum: ["Active", "Closed"],
    default: "Active",
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  createdAt: { type: Date, default: Date.now },
});

const drivemodel = mongoose.model("drive", driveSchema);

module.exports = drivemodel;
