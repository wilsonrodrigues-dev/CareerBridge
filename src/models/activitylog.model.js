const mongoose=require("mongoose")

const activityLogSchema = new mongoose.Schema({
  action: String,
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  createdAt: { type: Date, default: Date.now }
});

const activityLogmodel=mongoose.model("ActivityLog", activityLogSchema);

module.exports=activityLogmodel