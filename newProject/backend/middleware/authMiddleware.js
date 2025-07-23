const jwt = require('jsonwebtoken');
require('dotenv').config();
const userModel = require('../model/userModels'); 


const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified. Decoded:", decoded);    
    req.user = await userModel.findById(decoded.id);

    console.log("Decoded JWT:", decoded);
    console.log("User from DB:", req.user);

    next();
  } catch (err) {
    console.log("Token verification failed:", err.message);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = verifyToken;
