const nodemailer = require("nodemailer");
require("dotenv").config()

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail", //  email service
  auth: {
    user:process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

const sendEmail = async (to, subject, text,html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: to, 
      subject: subject, 
      text: text, 
      html:html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = sendEmail;
