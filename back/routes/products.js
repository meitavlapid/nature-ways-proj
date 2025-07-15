const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const collectionMap = {
  rehabilitation: "rehabilitation",
  pigmentation: "pigmentation",
  hairloss: "hairloss",
  weightloss: "weightloss",
  antiaging: "antiaging",
  skinquality: "skinquality",
  acne: "acne",
  psoriasis: "psoriasis",
};

function getModelForCategory(category) {
  const collectionName = collectionMap[category];
  if (!collectionName) return null;

  const modelName = `Product_${category}`;

  if (mongoose.models[modelName]) {
    console.log(`🔁 שימוש במודל קיים: ${modelName}`);
    return mongoose.models[modelName];
  }

  console.log(
    `🆕 יצירת מודל חדש: ${modelName} עבור קולקציה "${collectionName}"`
  );

  const schema = new mongoose.Schema({}, { strict: false });
  return mongoose.model(modelName, schema, collectionName);
}
// GET /api/products?category=...&subcategory=...
router.get("/", async (req, res) => {
  const { category, subcategory } = req.query;
  if (!category) return res.status(400).json({ message: "חסר פרמטר קטגוריה" });

  const ProductModel = getModelForCategory(category);
  if (!ProductModel)
    return res.status(400).json({ message: "קטגוריה לא תקפה" });

  const query = subcategory ? { subCategory: subcategory } : {};
  try {
    const products = await ProductModel.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בקבלת המוצרים", error: err });
  }
});

// GET /api/products/:id?category=...
router.get("/:id", async (req, res) => {
  const { category } = req.query;
  if (!category) return res.status(400).json({ message: "חסר פרמטר קטגוריה" });

  const ProductModel = getModelForCategory(category);
  if (!ProductModel)
    return res.status(400).json({ message: "קטגוריה לא תקפה" });

  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "מוצר לא נמצא" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בקבלת מוצר", error: err });
  }
});

// DELETE /api/products/:id?category=...
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { category } = req.query;
  if (!category) return res.status(400).json({ message: "חסר פרמטר קטגוריה" });

  const ProductModel = getModelForCategory(category);
  if (!ProductModel)
    return res.status(400).json({ message: "קטגוריה לא תקפה" });

  try {
    const deleted = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "מוצר לא נמצא" });
    res.json({ message: "המוצר נמחק בהצלחה" });
  } catch (err) {
    console.error("❌ שגיאה במחיקת מוצר:", err);
    res.status(500).json({ message: "שגיאה במחיקת מוצר", error: err });
  }
});

// PUT /api/products/:id?category=...
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { category } = req.query;
  const ProductModel = getModelForCategory(category);
  if (!ProductModel) {
    return res.status(400).json({ message: "קטגוריה לא תקפה" });
  }

  try {
    const updated = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updated);
  } catch (error) {
    console.error("❌ שגיאה בעדכון מוצר:", error);
    res.status(500).json({ message: "שגיאה בעדכון", error });
  }
});
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ message: "חסר פרמטר קטגוריה" });
  }

  const ProductModel = getModelForCategory(category);
  if (!ProductModel) {
    return res.status(400).json({ message: "קטגוריה לא תקפה" });
  }

  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("❌ שגיאה ביצירת מוצר:", error);
    res.status(500).json({ message: "שגיאה ביצירת מוצר", error });
  }
});

module.exports = router;
