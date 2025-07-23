const userModel = require('../model/userModels');
const bcrypt = require('bcrypt');

const updateUser = async (req, res) => {
  const { id } = req.params; 
  const { Name, email, mobileNumber, password } = req.body;

  try {
    const user = await userModel.findOne({ id: parseInt(id), role: 'user' });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (Name) user.Name = Name; 
    if (email) user.email = email;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (password) user.password = await bcrypt.hash(password, 10);

    user.updatedBy = req.user.Name || req.user.email;
    user.updatedAt = new Date();

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });

  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
};



const getAllUsers = async (req, res) => {
  try {
    const viewUsers = await userModel.find({ role: 'user', isDeleted: false });
    console.log("Fetched users from DB:", viewUsers)
    return res.status(200).json({
      message: "View all Users",
      users: viewUsers,  
    });

  } catch (err) {
    res.status(500).json({
      message: "Error viewing Users",
      error: err.message,
    });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findOne({ id, role: 'user' }); 
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isDeleted = true;
    user.deletedBy = req.user.email;
    user.deletedAt = new Date();

    await user.save();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};


module.exports = { deleteUser,updateUser,getAllUsers };
