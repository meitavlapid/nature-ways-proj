const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// אחסון רגיל לתמונות בלבד
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
const uploadImage = multer({ storage: imageStorage });

// אחסון זמני לקבצים לא־תמונתיים (Word/PDF)
const memoryStorage = multer.memoryStorage();
const uploadSpec = multer({ storage: memoryStorage });



router.post("/", uploadImage.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "קובץ לא התקבל" });
  }
  res.json({
    imageUrl: req.file.path,
    public_id: req.file.filename,
  });
});


router.delete("/:public_id", async (req, res) => {
  try {
    const { public_id } = req.params;
    const result = await cloudinary.uploader.destroy(`products/${public_id}`);
    res.json({ message: "תמונה נמחקה", result });
  } catch (err) {
    res.status(500).json({ error: "שגיאה במחיקת תמונה" });
  }
});


router.post("/spec", uploadSpec.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "לא נשלח קובץ" });
    }

  
    const ext = req.file.originalname.split(".").pop();
    const baseName = req.file.originalname.replace(/\.[^/.]+$/, ""); 

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "product-specs",
        public_id: `${baseName}-${Date.now()}`, 
        format: ext,
      },
      (error, result) => {
        if (error) {
          console.error("שגיאה בהעלאה ל-Cloudinary:", error);
          return res.status(500).json({ msg: "שגיאה בהעלאת הקובץ" });
        }
        res.json({ fileUrl: result.secure_url });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    console.error("❌ שגיאה בשרת:", err.message);
    res.status(500).json({ msg: "שגיאה בשרת" });
  }
});

module.exports = router;
