require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const uploadRoutes = require("./routes/upload");
const imageRoutes = require("./routes/images");
const aboutRoutes = require("./routes/about");
const contactRoutes = require("./routes/contact");
const articlesRoutes = require("./routes/articles");
const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/products");
const videoRoutes = require("./routes/videos");
const usersRouter = require("./routes/users");
const registrationRoute = require("./routes/registration");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
const allowedOrigins = [
  "http://localhost:5173", 
  "https://nature-ways.onrender.com", 
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.use("/api/images", imageRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/users", usersRouter);
app.use("/api/register", registrationRoute);

// ברירת מחדל
app.get("/", (req, res) => {
  res.send("API is working");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ מחובר ל־MongoDB:", mongoose.connection.name);
    app.listen(PORT, () => console.log(`🚀 השרת פועל על פורט ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ שגיאה בהתחברות ל־MongoDB:", err);
  });
app.use((err, req, res, next) => {
  console.error("💥 שגיאה כללית:", err.stack);
  res.status(500).json({ msg: "שגיאה בשרת" });
});
