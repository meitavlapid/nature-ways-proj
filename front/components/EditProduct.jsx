import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../src/services/api";
import "../css/EditProduct.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    api
      .get(`/api/products/${id}?category=${category}`)
      .then((res) => {
        setProduct(res.data);
        setFormData(res.data);
      })
      .catch((err) => console.error("שגיאה בטעינת מוצר:", err.message));
  }, [id, category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file) => {
    const formDataImage = new FormData();
    formDataImage.append("image", file);

    try {
      const res = await api.post("/api/upload", formDataImage, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
    } catch (error) {
      console.error("שגיאה בהעלאת תמונה:", error.message);
      alert("העלאת התמונה נכשלה");
    }
  };
  const handleSpecFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file); 

    try {
      const res = await api.post("/api/upload/spec", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, specFileUrl: res.data.fileUrl }));
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ:", error.message);
      alert("העלאת קובץ המפרט נכשלה");
    }
  };
  

  const handleListChange = (field, index, value) => {
    const updatedList = [...formData[field]];
    updatedList[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedList }));
  };

  const handleRemoveListItem = (field, index) => {
    const updatedList = [...formData[field]];
    updatedList.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: updatedList }));
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

  const handleAddSection = () => {
    const newSection = { title: "", items: [""] };
    setFormData((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }));
  };

  const handleAddItemToSection = (sectionIndex) => {
    const updated = [...formData.sections];
    updated[sectionIndex].items.push("");
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const handleRemoveSectionItem = (sectionIndex, itemIndex) => {
    const updated = [...formData.sections];
    updated[sectionIndex].items.splice(itemIndex, 1);
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const handleRemoveSection = (sectionIndex) => {
    const updated = [...formData.sections];
    updated.splice(sectionIndex, 1);
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/products/${id}?category=${category}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("המוצר עודכן בהצלחה");
      navigate("/");
    } catch (error) {
      console.error("שגיאה בעדכון המוצר:", error.message);
      alert("אירעה שגיאה בעדכון");
    }
  };

  if (!product) return <p>טוען...</p>;

  return (
    <div className="edit-product-container">
      <h2>עריכת מוצר: {product.name}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">שם</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">קטגוריה</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={formData.category || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">תת-קטגוריה</label>
          <input
            type="text"
            name="subCategory"
            className="form-control"
            value={formData.subCategory || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">תיאור מקוצר</label>
          <textarea
            name="shortDescription"
            className="form-control"
            value={formData.shortDescription || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">תיאור מלא</label>
          <textarea
            name="fullDescription"
            className="form-control"
            value={formData.fullDescription || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">תמונה</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="תצוגה מקדימה"
              className="img-thumbnail mt-2"
              style={{ maxWidth: "200px" }}
            />
          )}
        </div>

        {[
          "activeIngredients",
          "suitableFor",
          "mechanism",
          "features",
          "warnings",
          "instructions",
        ].map((field) => (
          <div key={field} className="mb-3">
            <label className="form-label">{field}</label>
            {formData[field]?.map((item, index) => (
              <div className="input-group mb-1" key={index}>
                <input
                  className="form-control"
                  value={item}
                  onChange={(e) =>
                    handleListChange(field, index, e.target.value)
                  }
                />
                <button
                  type="button"
                  className="btn"
                  onClick={() => handleRemoveListItem(field, index)}
                >
                  ✖
                </button>
              </div>
            ))}

            <button
              type="button"
              className="btn"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  [field]: [...(prev[field] || []), ""],
                }))
              }
            >
              הוסף שורה
            </button>
          </div>
        ))}

        <>
          <label className="form-label">קובץ מפרט (Word או PDF)</label>
          <input
            type="file"
            className="form-control"
            accept=".doc,.docx,.pdf"
            onChange={(e) => handleSpecFileUpload(e.target.files[0])}
          />
          {formData.specFileUrl && (
            <div className="mt-2">
              <a
                href={formData.specFileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                צפייה בקובץ המפרט הקיים
              </a>
            </div>
          )}
        </>
        <hr />
        <h4>כותרות ותוכן נוסף</h4>
        {formData.sections?.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-4">
            <h6>
              כותרת {sectionIndex + 1}
              <button
                type="button"
                onClick={() => handleRemoveSection(sectionIndex)}
              >
                מחק כותרת
              </button>
            </h6>
            <input
              type="text"
              className="form-control mb-2"
              value={section.title}
              onChange={(e) =>
                handleSectionChange(sectionIndex, "title", e.target.value)
              }
            />
            {section.items.map((item, itemIndex) => (
              <div className="input-group mb-1" key={itemIndex}>
                <input
                  type="text"
                  className="form-control"
                  value={item}
                  onChange={(e) =>
                    handleSectionItemChange(
                      sectionIndex,
                      itemIndex,
                      e.target.value
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveSectionItem(sectionIndex, itemIndex)
                  }
                >
                  ✖
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddItemToSection(sectionIndex)}
            >
              הוסף שורה
            </button>
          </div>
        ))}

        <button
          type="button"
          className="add-section"
          onClick={handleAddSection}
        >
          הוסף כותרת
        </button>

        <button type="submit">שמור</button>
      </form>
    </div>
  );
}

export default EditProduct;
