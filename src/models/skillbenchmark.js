const mongoose=require("mongoose")

const skillBenchmarkSchema = new mongoose.Schema({
  roleName: String,
  requiredSkills: [String]
});

const skillBenchmarkmodel=mongoose.model("skillsbenchmark",skillBenchmarkSchema)

module.exports=skillBenchmarkmodel