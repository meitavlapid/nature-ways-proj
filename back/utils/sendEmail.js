const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendEmail({ to, subject, token, name }) {
  await transporter.sendMail({
    from: `"NatureWays" <${process.env.MAIL_USER}>`,
    to,
    subject: "איפוס סיסמה לנייצ'ר וויז",
    html: `
      <div dir="rtl" style="text-align: right; font-family: Arial, sans-serif; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dt5nnq3ew/image/upload/v1750344062/logo_ul47xl.png" alt="Nature Ways Logo" style="max-width: 180px;" />
        </div>
        <h2>היי ${name || ""},</h2>
        <p>ביקשת לאפס את הסיסמה שלך לנייצ'ר וויז?</p>
        <p>אין בעיה – גם לנו קורה לשכוח.</p>
        <p>לחיצה על הכפתור הבא תיקח אותך לאיפוס סיסמה:</p>
        <br/>
        <a href="${process.env.CLIENT_URL}/reset-password/${token}" 
           style="display: inline-block; padding: 10px 20px; background-color: #4e643b; color: #fff; text-decoration: none; border-radius: 6px;">
          אפס סיסמה
        </a>
        <br/><br/>
        <p style="color: #999;">אם לא ביקשת איפוס, התעלם מהודעה זו.</p>
        <p><strong>בברכה,<br/>צוות נייצ'ר וויז 🌿</strong></p>
      </div>
    `,
  });
}


module.exports = sendEmail;
