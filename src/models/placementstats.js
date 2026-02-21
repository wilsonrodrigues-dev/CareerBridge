const mongoose=require("mongoose")

const placementStatsSchema = new mongoose.Schema({
  totalStudentsPlaced: Number,
  highestPackage: Number,
  averagePackage: Number,
  companiesVisited: Number,
  placementRate: Number,
  academicYear: String
});

const placementStatsmodel=mongoose.model("placementstats",placementStatsSchema)

module.exports=placementStatsmodel