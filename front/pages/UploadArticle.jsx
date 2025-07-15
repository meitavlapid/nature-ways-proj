import React, { useState } from "react";
import api from "../src/services/api";
import "../css/UploadArticle.css";

function UploadArticle() {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    image: "",
    sections: [{ subtitle: "", paragraph: "" }],
    conclusion: "",
    bibliography: "",
    tags: [], 
  });;
  const [newTag, setNewTag] = useState("");
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...formData.tags];
    updatedTags.splice(index, 1);
    setFormData((prev) => ({ ...prev, tags: updatedTags }));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSectionChange = (index, field, value) => {
    const updated = [...formData.sections];
    updated[index][field] = value;
    setFormData({ ...formData, sections: updated });
  };

  const handleAddSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { subtitle: "", paragraph: "" }],
    });
  };

  const handleImageUpload = async (file) => {
    const data = new FormData();
    data.append("image", file);
    try {
      const res = await api.post("/api/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
    } catch (err) {
      alert("שגיאה בהעלאת תמונה");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/articles", formData);
      alert("המאמר נשמר בהצלחה!");
      setFormData({
        title: "",
        summary: "",
        image: "",
        sections: [{ subtitle: "", paragraph: "" }],
        conclusion: "",
        bibliography: "",
        tag: "",
      });
    } catch (err) {
      console.error("שגיאה בהעלאה:", err.message);
      alert("אירעה שגיאה בשמירת המאמר");
    }
  };

  return (
    <div className="upload-article-container">
      <h2>העלאת מאמר חדש</h2>
      <form onSubmit={handleSubmit}>
        <label>כותרת</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>תקציר</label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          rows="3"
          required
        />

        <label>תמונה</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />
        {formData.image && (
          <img src={formData.image} alt="תצוגה" style={{ maxWidth: "200px" }} />
        )}

        {formData.sections.map((section, index) => (
          <div key={index} className="section-block">
            <label>תת כותרת</label>
            <input
              type="text"
              value={section.subtitle}
              onChange={(e) =>
                handleSectionChange(index, "subtitle", e.target.value)
              }
            />
            <label>פסקה</label>
            <textarea
              rows="4"
              value={section.paragraph}
              onChange={(e) =>
                handleSectionChange(index, "paragraph", e.target.value)
              }
            />
          </div>
        ))}

        <button type="button" onClick={handleAddSection}>
          הוסף מקטע
        </button>

        <label>סיכום</label>
        <textarea
          name="conclusion"
          value={formData.conclusion}
          onChange={handleChange}
          rows="3"
          required
        />

        <label>ביבליוגרפיה</label>
        <textarea
          name="bibliography"
          value={formData.bibliography}
          onChange={handleChange}
          rows="3"
          required
        />

        <label>תגיות</label>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                backgroundColor: "#d1e7dd",
                padding: "5px 10px",
                borderRadius: "15px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                style={{
                  background: "none",
                  border: "none",
                  marginLeft: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="הוסיפי תגית"
          />
          <button type="button" onClick={handleAddTag}>
            הוסף
          </button>
        </div>

        <button type="submit">שמור מאמר</button>
      </form>
    </div>
  );
}

export default UploadArticle;
