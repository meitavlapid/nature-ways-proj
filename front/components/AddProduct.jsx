import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import api from "../src/services/api";
import "../css/EditProduct.css";

function AddProduct() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    category: category || "",
    subCategory: "",
    shortDescription: "",
    fullDescription: "",
    image: "",
    mechanism: [""],
    activeIngredients: [""],
    features: [""],
    suitableFor: [""],
    instructions: [""],
    warnings: [""],
    sections: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleListChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const addListItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeListItem = (field, index) => {
    const updated = [...formData[field]];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const handleAddSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: "", items: [""] }],
    }));
  };

  const handleSectionChange = (index, field, value) => {
    const updated = [...formData.sections];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const handleSectionItemChange = (sectionIndex, itemIndex, value) => {
    const updated = [...formData.sections];
    updated[sectionIndex].items[itemIndex] = value;
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const handleAddItemToSection = (sectionIndex) => {
    const updated = [...formData.sections];
    updated[sectionIndex].items.push("");
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const handleRemoveSection = (index) => {
    const updated = [...formData.sections];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const handleRemoveSectionItem = (sectionIndex, itemIndex) => {
    const updated = [...formData.sections];
    updated[sectionIndex].items.splice(itemIndex, 1);
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("image", file);
    try {
      const res = await api.post("/api/upload", data);
      setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
    } catch (err) {
      console.error("שגיאה בהעלאת תמונה:", err);
      alert("שגיאה בהעלאת תמונה");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/products?category=${category}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("המוצר נוסף בהצלחה");
      navigate("/admin/products");
    } catch (err) {
      console.error("שגיאה בהוספת מוצר:", err);
      alert("שגיאה בהוספה");
    }
  };

  return (
    <div className="edit-product-container" dir="rtl">
      <h2>הוספת מוצר חדש</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">שם</label>
          <input
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">קטגוריה</label>
          <input
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">תת קטגוריה</label>
          <input
            name="subCategory"
            className="form-control"
            value={formData.subCategory}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">תיאור מקוצר</label>
          <textarea
            name="shortDescription"
            className="form-control"
            value={formData.shortDescription}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">תיאור מלא</label>
          <textarea
            name="fullDescription"
            className="form-control"
            value={formData.fullDescription}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">תמונה</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageUpload}
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="תצוגה"
              className="img-fluid mt-2"
              style={{ maxWidth: "200px" }}
            />
          )}
        </div>

        {[
          "mechanism",
          "activeIngredients",
          "features",
          "suitableFor",
          "warnings",
          "instructions",
        ].map((field) => (
          <div key={field} className="mb-3">
            <label className="form-label">{field}</label>
            {formData[field].map((item, index) => (
              <div key={index} className="input-group mb-1">
                <input
                  className="form-control"
                  value={item}
                  onChange={(e) =>
                    handleListChange(field, index, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeListItem(field, index)}
                >
                  ✖
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addListItem(field)}>
              הוסף
            </button>
          </div>
        ))}

        <h4>כותרות ותוכן</h4>
        {formData.sections.map((section, i) => (
          <div key={i} className="mb-4">
            <label className="form-label">כותרת {i + 1}</label>
            <input
              className="form-control mb-2"
              value={section.title}
              onChange={(e) => handleSectionChange(i, "title", e.target.value)}
            />
            {section.items.map((item, j) => (
              <div className="input-group mb-1" key={j}>
                <input
                  className="form-control"
                  value={item}
                  onChange={(e) =>
                    handleSectionItemChange(i, j, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSectionItem(i, j)}
                >
                  ✖
                </button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddItemToSection(i)}>
              הוסף שורה
            </button>
            <button type="button" onClick={() => handleRemoveSection(i)}>
              מחק כותרת
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddSection}>
          הוסף כותרת
        </button>

        <button type="submit">שמור מוצר</button>
      </form>
    </div>
  );
}

export default AddProduct;
