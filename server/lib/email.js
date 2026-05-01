const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
    pass: process.env.EMAIL_PASS || 'ethereal_pass'
  }
});

const sendWelcomeEmail = async (toEmail, firstName) => {
  try {
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; background-color: #fffaf0; padding: 20px; border-radius: 8px;">
        <h2 style="color: #4a3b32;">Welcome to Noir Luxe, ${firstName}!</h2>
        <p>We are thrilled to have you join our exclusive community.</p>
        <p>Explore our latest premium collections and experience luxury like never before.</p>
        <a href="http://localhost:3000" style="display: inline-block; background-color: #d4af37; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 15px;">Visit Our Store</a>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"Noir Luxe" <noreply@noirluxe.com>',
      to: toEmail,
      subject: "Welcome to Noir Luxe",
      html: htmlBody,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendWelcomeEmail };
