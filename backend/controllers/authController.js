const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER USER =================
const registerUser = async (req, res) => {
  try {
   
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const user = await User.create({
      name,
      email,
      password, // hashed by schema
    });

    return res.status(201).json({
      message: "User registered successfully!",
      userId: user._id,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN USER =================
const loginUser = async (req, res) => {
  try {
   console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ===================== ABSOLUTE FIX =====================
    // 1. Try Render env variable
    // 2. If undefined, fallback secret guaranteed
    const jwtSecret = process.env.JWT_SECRET || "temporary_super_secret_key_for_render"; // fallback guaranteed
console.log("Using JWT_SECRET:", jwtSecret); // temporary debug, safe to remove later

const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1d" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
};
