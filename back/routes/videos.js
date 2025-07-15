const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");
const Video = require("../models/Video");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// הגדרת אחסון בזיכרון והגבלת גודל קובץ (100MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, 
});

// קונפיגורציה של Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const streamUpload = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "videos",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// קבלת רשימת סרטונים
router.get("/", async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

// העלאת סרטון חדש
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  upload.single("video"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "לא נשלח קובץ וידאו" });
    }

    try {
      console.log("📦 קובץ מתקבל:", req.file.originalname, req.file.size);
      const result = await streamUpload(req.file.buffer);

      const newVideo = new Video({
        url: result.secure_url,
        publicId: result.public_id,
      });

      await newVideo.save();
      res.status(201).json(newVideo);
    } catch (err) {
      console.error("❌ שגיאה בהעלאה ל־Cloudinary:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: err.message });
      }
    }
  }
);

// מחיקת סרטון
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "וידאו לא נמצא" });

    const result = await cloudinary.uploader.destroy(video.publicId, {
      resource_type: "video",
    });

    if (result.result !== "ok") {
      console.error("❌ Cloudinary deletion failed:", result);
      return res.status(500).json({ error: "מחיקה מהענן נכשלה" });
    }

    await Video.findByIdAndDelete(req.params.id);

    res.json({ msg: "וידאו נמחק בהצלחה" });
  } catch (err) {
    console.error("❌ שגיאה במחיקה:", err);
    res.status(500).json({ error: "שגיאה במחיקת וידאו" });
  }
});

module.exports = router;
