const otpModel = require('../model/otpModels'); 
const otpGenerator = require('otp-generator');
const sendEmail = require('../utills/mailSender'); 
const userModel = require('../model/userModels'); 


const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Email received for OTP:", email); 

    const OTP = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const savedOtp = await otpModel.create({ email, otp: OTP });
    console.log("OTP saved to DB:", savedOtp);
    
    await sendEmail(
      email,
      "Your OTP Code",
      `<p>Your OTP is <b>${OTP}</b>. It will expire in 5 minutes.</p>`
    );

    const userExists = await userModel.findOne({ email });

    
    res.status(200).json({
      message: "OTP sent successfully",
      existingUser: !!userExists
    });

  } catch (err) {
    console.log("Controller Error:", err);  
    res.status(500).json({ error: err.message });
  }
};


module.exports = { sendOtp };
