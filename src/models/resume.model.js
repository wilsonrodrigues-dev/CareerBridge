const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  template: String,
  summary: String,
  projects: [
    {
      title: String,
      description: String
    }
  ],
  certifications: [String],
  createdAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model("Resume", resumeSchema);