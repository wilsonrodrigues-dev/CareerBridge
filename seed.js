require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/user.model");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashed = await bcrypt.hash("123456", 10);

  await User.create({
    name: "Vineeth",
    email: "Vineeth@college.com",
    password: hashed,
    role: "student"
  });



  console.log("Seed data created");
  process.exit();
});