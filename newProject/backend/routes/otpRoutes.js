const express = require('express');
const router = express.Router();

const { sendOtp } = require('../controller/otpController');

router.post("/sendOtp",sendOtp);



module.exports = router;


