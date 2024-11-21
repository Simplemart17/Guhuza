const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const { OAuth2 } = google.auth;

const clientId = process.env.MAIL_CLIENT_ID;
const clientSecret = process.env.MAIL_CLIENT_SECRET;
const refreshToken = process.env.MAIL_REFRESH_TOKEN;
const redirectUri = process.env.MAIL_REDIRECT_URI;

const OAuth2Client = new OAuth2(clientId, clientSecret, redirectUri);

OAuth2Client.setCredentials({
  refresh_token: refreshToken,
});

const newAccessToken = OAuth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: "simplemart.dev@gmail.com",
    clientId: process.env.MAIL_CLIENT_ID,
    clientSecret: process.env.MAIL_CLIENT_SECRET,
    refreshToken: process.env.MAIL_REFRESH_TOKEN,
    accessToken: newAccessToken,
    expires: 1484314697598,
    tls: {
      rejectUnauthorized: false,
    },
  },
});

async function sendEmail(subject, body, to) {
  const html = body;
  try {
    const msg = {
      from: "simplemart.dev@gmail.com",
      to: to,
      subject: subject,
      html,
      envelope: {
        from: "simplemart.dev@gmail.com",
        to: to,
      },
    };

    const mail = await transporter.sendMail(msg);
    if (mail.messageId) {
      return { success: true };
    }
  } catch (error) {
    console.log(error, "Error sending email");
    return error;
  }
}

module.exports = sendEmail;
