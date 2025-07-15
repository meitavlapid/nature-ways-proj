const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (to, name) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  console.log(" שולח דרך:", process.env.MAIL_USER);

  try {
    await transporter.sendMail({
      from: `"Nature Ways" <${process.env.MAIL_USER}>`,
      to,
      subject: "ברוכים הבאים לנייצ'ר וויז!",
      html: `
        <div dir="rtl" style="text-align: right; font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 1rem;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://res.cloudinary.com/dt5nnq3ew/image/upload/v1750344062/logo_ul47xl.png" alt="Nature Ways Logo" style="max-width: 200px; height: auto;" />
          </div>
          <h2 style="color: #4e643b;">היי ${name},</h2>
          <p>שמחים שהצטרפת – מעכשיו אנחנו לגמרי יחד בזה.</p>
          <p>בקרוב יתחילו לנחות אצלך בתיבה תכנים מדויקים, מקצועיים ולגמרי שווים.</p>
          <br/>
          <p>נשמח ללוות אותך במסע לטיפול טבעי, חכם ומותאם בדיוק לך.</p>
          <p style="margin-top: 2rem;">
            <strong>
              שלך,<br/>
              צוות נייצ'ר וויז 🌿
            </strong>
          </p>
        </div>
      `,
    });

    console.log(" מייל נשלח ל:", to);
  } catch (err) {
    console.error(" שגיאה בשליחת המייל:", err.message);
  }
};

module.exports = sendWelcomeEmail;
