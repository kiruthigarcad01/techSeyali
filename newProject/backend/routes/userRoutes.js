const express = require('express');
const router = express.Router();

const { signUp,login,resetPassword } = require('../controller/userController');

router.post("/signUp",signUp);
router.post("/login",login);
router.post("/resetPassword", resetPassword);






module.exports = router;