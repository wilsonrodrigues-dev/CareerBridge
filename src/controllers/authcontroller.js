const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔹 LOGIN (Student + Admin)
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1️⃣ Check user exists
    const user = await User.findOne({ email });

    console.log("Searching for:", email);
    console.log("User found:", user);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 2️⃣ Check role matches
    if (user.role !== role) {
      return res.status(403).json({ message: "Access denied for this role" });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.json({
      message: "Login successful",
      role: user.role,
      token,
      user:{
        id:user._id,
        name:user.name,
        email:user.email
      },

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = login;
