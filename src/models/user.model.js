const mongoose=require("mongoose")


const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ["student", "placementOfficer"],
  },

  profileCompleted: { type: Boolean, default: false },

  academicInfo: {
    course: String,
    branch: String,
    cgpa: Number,
    backlogs: Number,
    batch: String,
  },

  skills: [String],

  placementStatus: {
    type: String,
    enum: ["Not Placed", "Placed"],
    default: "Not Placed",
  },

  createdAt: { type: Date, default: Date.now }
});

const usermodel=mongoose.model("user",userSchema)

module.exports=usermodel