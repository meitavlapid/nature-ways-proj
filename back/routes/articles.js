const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

router.post("/", async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    console.error("שגיאה בשמירת מאמר:", err.message);
    res.status(500).json({ error: "שגיאה בשמירת מאמר" });
  }
});

router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "שגיאה בטעינת מאמרים" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "לא נמצא" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: "שגיאה בטעינה" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "מאמר לא נמצא" });
    res.json(updated);
  } catch (err) {
    console.error("שגיאה בעדכון:", err);
    res.status(500).json({ error: "שגיאה בעדכון המאמר" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "מאמר לא נמצא" });
    res.json({ message: "המאמר נמחק בהצלחה" });
  } catch (err) {
    console.error("שגיאה במחיקת מאמר:", err.message);
    res.status(500).json({ message: "שגיאה במחיקת מאמר" });
  }
});
module.exports = router;
