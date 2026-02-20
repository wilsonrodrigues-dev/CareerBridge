const mongoose=require("mongoose")

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },

  drive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Drive"
  },

  status: {
    type: String,
    enum: [
      "Applied",
      "Aptitude Scheduled",
      "Interview Scheduled",
      "Selected",
      "Rejected"
    ],
    default: "Applied"
  },

  interviewDate: Date,

  appliedAt: { type: Date, default: Date.now }
});

const applicationmodel=mongoose.model("application",applicationSchema)

module.exports=applicationmodel