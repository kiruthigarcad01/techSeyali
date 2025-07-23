const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../model/userModels');      
const otpModel = require('../model/otpModels');        
require('dotenv').config();


const signUp = async (req, res) => {
  const { id, Name, email, mobileNumber, password, otp } = req.body;

  try {
    const recentOtp = await otpModel.find({ email }).sort({ createdAt: -1 }).limit(1);

    console.log("recentOtp:", recentOtp);

    if (!recentOtp || recentOtp.length === 0 || !recentOtp[0]?.otp) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    console.log("OTP from DB:", recentOtp[0].otp);
    console.log("OTP from user input:", String(otp));

    if (recentOtp[0].otp !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      id,
      Name,
      email,
      mobileNumber,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User signUp successfully", newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login attempt for:", email);

    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user);
    console.log("Entered password:", password);
    console.log("Hashed password in DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match result:", isMatch);

    if (!isMatch) {
      console.log("Invalid password");
      return res.status(403).json({ message: "Invalid password" });
    }

    

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: "2h"}
    );

    console.log("Token generated");

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        Name: user.Name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};


const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const recentOtp = await otpModel.find({ email }).sort({ createdAt: -1 }).limit(1);

    if (
      recentOtp.length === 0 ||
      String(recentOtp[0].otp) !== String(otp)
    ) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await userModel.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Error:", err); 
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  signUp,
  login,
  resetPassword 
};



