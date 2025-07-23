const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false  
  }
  
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"Auth System" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

module.exports = sendEmail;
