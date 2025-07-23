require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const userModel = require('./model/userModels'); 

const seedManager = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/myDemo");
    console.log("Connected to DB");

    const existing = await userModel.findOne({ email: "manager1@gmail.com" });
    if (existing) {
      console.log("Manager already exists.");
      
      const token = jwt.sign(
        { id: existing._id, email: existing.email, role: existing.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      console.log("🪪 Existing Manager Token:\n", token);
      return;
    }

    const hashedPassword = await bcrypt.hash("manager123", 10);

    const manager = await userModel.create({
      id: 15,
      Name: "Babu",
      email: "manager1@gmail.com",
      mobileNumber: "1234567890",
      password: hashedPassword,
      role: "manager",
    });

    
    const token = jwt.sign(
      { id: manager._id, email: manager.email, role: manager.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("Manager seeded successfully!");
    console.log("Email: manager1@gmail.com");
    console.log("Password: manager123");
    console.log("JWT Token:\n", token);

  } catch (err) {
    console.error("Error seeding manager:", err.message);
  } finally {
    mongoose.disconnect();
  }
};

seedManager();
