const SkillBenchmark = require("../models/skillbenchmark");

// 🔹 Create Benchmark
const createBenchmark = async (req, res) => {
  try {
    const { roleName, requiredSkills } = req.body;

    const benchmark = await SkillBenchmark.create({
      roleName,
      requiredSkills
    });

    res.status(201).json({
      message: "Benchmark created successfully",
      benchmark
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get All Benchmarks
const getAllBenchmarks = async (req, res) => {
  try {
    const benchmarks = await SkillBenchmark.find();

    res.json(benchmarks);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Update Benchmark
const updateBenchmark = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await SkillBenchmark.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Benchmark updated",
      updated
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Delete Benchmark
const deleteBenchmark = async (req, res) => {
  try {
    const { id } = req.params;

    await SkillBenchmark.findByIdAndDelete(id);

    res.json({ message: "Benchmark deleted" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports={createBenchmark,getAllBenchmarks,updateBenchmark,deleteBenchmark}