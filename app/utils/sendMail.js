const nodemailer = require("nodemailer");

function sendEmail(mailOptions) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // const mailOptions = {
  //   from: process.env.EMAIL_USER,
  //   to: email,
  //   subject: "You're Invited!",
  //   text: `Hello,\n\nYou have been invited by ${data.fullname} to join our platform. Please click the link below to register:\n\nhttp://localhost:3000/accept-invite?email=${data.email}\n\nBest regards,\nYour App Team`,
  // };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: "Failed to send invite email" });
    }
    res.json({
      status: 201,
      message: "Invite sent successfully!",
      invite,
    });
  });
}

module.exports = sendEmail;
