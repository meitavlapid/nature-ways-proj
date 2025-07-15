const express = require("express");
const router = express.Router();
const AboutPage = require("../models/About");

// GET: שליפת תוכן דף אודות
router.get("/", async (req, res) => {
  try {
    const about = await AboutPage.findOne();
    res.json(about || {});
  } catch (err) {
    res.status(500).json({ error: "שגיאת שרת" });
  }
});

// PUT: עדכון תוכן (רק אדמין)
router.put("/", async (req, res) => {
  const { paragraphs, imageUrl, teamMembers, highlights, footer } = req.body;

  try {
    let about = await AboutPage.findOne();
    if (!about) {
      about = new AboutPage();
    }

    about.paragraphs = paragraphs;
    about.imageUrl = imageUrl;
    about.teamMembers = teamMembers;
    about.highlights = highlights;
    about.footer = footer;

    await about.save();
    res.json({ message: "עודכן בהצלחה" });
  } catch (err) {
    res.status(500).json({ error: "שגיאה בעדכון הדף" });
  }
});

module.exports = router;
