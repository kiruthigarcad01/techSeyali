const userModel = require('../model/userModels')


const allowRoles = (...roles) => {
  return (req, res, next) => {
    console.log("Role required:", roles);
    console.log("Logged-in role:", req.user.role);

    if (!roles.includes(req.user.role)) {
      console.log("Access denied: Role mismatch");
      return res.status(403).json({ message: "Access Denied: Unauthorized role" });
    }
    console.log("Access granted");
    next();
  };
};







module.exports = { allowRoles };


