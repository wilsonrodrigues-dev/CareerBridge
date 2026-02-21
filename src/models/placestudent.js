const mongoose=require("mongoose")

const placedStudentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },

  companyName: String,
  role: String,
  packageOffered: Number,
  placedDate: Date
});

const placedStudentmodel=mongoose.model("placedstudent",placedStudentSchema)