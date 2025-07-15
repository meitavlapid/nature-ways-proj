// routes/contact.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

router.post("/", async (req, res) => {
  const { fullname, phone, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Nature Ways <${process.env.MAIL_USER}>`,
    to: "shimrit@sweetvictory-gum.com, gitit@sweetvictory-gum.com",
    subject: "התקבל ליד מאתר נייצ’ר וויז",
    text: `התקבל ליד מאתר נייצ’ר וויז:

שם מלא: ${fullname}
טלפון: ${phone}
אימייל: ${email}
הודעה: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error("שגיאה בשליחת מייל:", err);
    res.status(500).json({ success: false, error: "Email failed" });
  }
});

module.exports = router;
