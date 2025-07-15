import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../src/services/api";
import "../css/UploadArticle.css";

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    api
      .get(`/api/articles/${id}`)
      .then((res) => {
        const data = res.data;
        if (!data.tags) data.tags = []; 
        setFormData(data);
      })
      .catch(() => {
        alert("שגיאה בטעינת המאמר");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (index, field, value) => {
    const updated = [...formData.sections];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const handleAddSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, { subtitle: "", paragraph: "" }],
    }));
  };

  const handleImageUpload = async (file) => {
    const data = new FormData();
    data.append("image", file);
    try {
      const res = await api.post("/api/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
    } catch {
      alert("שגיאה בהעלאת תמונה");
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/articles/${id}`, formData);
      alert("המאמר עודכן בהצלחה!");
      navigate("/articles");
    } catch {
      alert("שגיאה בעדכון המאמר");
    }
  };

  if (!formData) return <p>טוען...</p>;

  return (
    <div className="upload-article-container">
      <h2>עריכת מאמר</h2>
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
        <div className="tag-input-group">
          <input
            type="text"
            value={newTag}
            placeholder="הקלד תגית"
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button type="button" onClick={handleAddTag}>
            הוסף
          </button>
        </div>

        <div className="tag-preview">
          {formData.tags.map((tag, idx) => (
            <span key={idx} className="tag-label">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(tag)}>
                ✕
              </button>
            </span>
          ))}
        </div>

        <button type="submit">שמור שינויים</button>
      </form>
    </div>
  );
}

export default EditArticle;
