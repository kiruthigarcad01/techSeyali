const userModel = require('../model/userModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createAdmin = async (req, res) => {
  const { id, Name, email, mobileNumber, password } = req.body;

  try {
    
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await userModel.create({
      id,
      Name,
      email,
      mobileNumber,
      password: hashedPassword,
      role: 'admin',
      createdBy: req.user?.email || 'System'
    });

    
    const token = jwt.sign(
      { id: newAdmin._id, email: newAdmin.email, role: newAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

   
    const { password: _, ...adminWithoutPassword } = newAdmin._doc;

    
    res.status(201).json({
      message: "Admin created by manager",
      token,
      newAdmin: adminWithoutPassword
    });

  } catch (err) {
    res.status(500).json({ message: "Admin creation failed", error: err.message });
  }
};


const getAllAdmins = async (req, res) => {
  try {
    const viewAdmins = await userModel.find({ role: 'admin', isDeleted: false });

    return res.status(200).json({
      message: "View all Admins",
      admins: viewAdmins,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error viewing admins",
      error: err.message,
    });
  }
};



const updateAdmin = async (req, res) => {
  const { id } = req.params; 
  const { Name, email, mobileNumber, password } = req.body;

  try {
    const admin = await userModel.findOne({ id, role: 'admin' });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    
    if (Name) admin.Name = Name;
    if (email) admin.email = email;
    if (mobileNumber) admin.mobileNumber = mobileNumber;
    if (password) admin.password = await bcrypt.hash(password, 10);

    admin.updatedBy = req.user.Name || req.user.email
    admin.updatedAt = new Date();

    await admin.save();
    res.status(200).json({ message: "Admin updated successfully", admin });

  } catch (err) {
    res.status(500).json({ message: "Error updating admin", error: err.message });
  }
};


const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  console.log("Received DELETE ID:", id);

  try {
    const deletedAdmin = await userModel.findOneAndDelete({ _id: id, role: 'admin' });

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found or already deleted" });
    }

    res.status(200).json({ message: "Admin deleted successfully", deletedAdmin });

  } catch (err) {
    console.error("🔥 DELETE ERROR:", err);
    res.status(500).json({ message: "Error deleting admin", error: err.message });
  }
};



module.exports = { createAdmin,updateAdmin,getAllAdmins,deleteAdmin };