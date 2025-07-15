const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "שגיאה בטעינת המשתמשים" });
  }
});

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (req.user && req.user._id && id === String(req.user._id)) {
    return res.status(400).json({ error: "לא ניתן למחוק את עצמך" });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "משתמש לא נמצא" });

    await user.deleteOne();
    res.json({ message: "המשתמש נמחק בהצלחה" });
  } catch (err) {
    console.error("❌ שגיאה במחיקת משתמש:", err.message);
    res.status(500).json({ error: "שגיאה במחיקת המשתמש" });
  }
});

router.put("/:id/role", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ error: "ערך הרשאה לא חוקי" });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "משתמש לא נמצא" });

    user.role = role;
    await user.save();
    res.json({ message: "הרשאות עודכנו" });
  } catch (err) {
    res.status(500).json({ error: "שגיאה בעדכון הרשאות" });
  }
});
module.exports = router;
