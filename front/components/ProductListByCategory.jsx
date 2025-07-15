import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import api from "../src/services/api";
import { Pencil, Trash } from "react-bootstrap-icons";
import "../css/ProductListByCategory.css";

const CATEGORY_LABELS = {
  acne: "מוצרים לטיפול באקנה",
  psoriasis: "מוצרים לטיפול בפסוריאזיס",
  pigmentation: "מוצרים לטיפול בפיגמנטציה",
  antiaging: "מוצרים לטיפול באנטי אייג'ינג",
  rehabilitation: "מוצרים לשיקום העור לאחר טיפולים",
  weightloss: "מוצרים לטיפול בירידה במשקל",
  hairloss: "מוצרים לטיפול בהתקרחות גברית",
  skinquality: "מוצרים לטיפול באיכות ומרקם האור",
};

function ProductListByCategory() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const { user, isAdmin } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/api/products?category=${category}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("שגיאה בקבלת נתונים:", err.message));
  }, [category]);

  const handleEdit = (productId) => {
    navigate(`/admin/edit/${productId}?category=${category}`);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("האם את בטוחה שברצונך למחוק את המוצר?")) return;
    try {
      await api.delete(`/api/products/${productId}?category=${category}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("שגיאה במחיקת מוצר:", err.message);
      alert("אירעה שגיאה בעת המחיקה");
    }
  };

  const title = CATEGORY_LABELS[category] || `מוצרים בקטגוריה: ${category}`;

  return (
    <div className="container mt-5 mb-5" dir="rtl">
      <h1>{title}</h1>

      {isAdmin && (
        <div>
          <button
            type="button"
            className="btn"
            onClick={() => navigate(`/admin/add?category=${category}`)}
          >
            הוספת מוצר חדש
          </button>
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-center">לא נמצאו מוצרים בקטגוריה זו.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {products.map((product) => (
            <div className="col" key={product._id}>
              <div className="card-product">
                <img
                  src={product.image || `/images/${category}-default.jpg`}
                  className="card-img-top"
                  alt={product.name}
                />
                <div className="card-column">
                  <h5 className="card-title text-center">{product.name}</h5>
                  <p className="card-text">{product.shortDescription}</p>

                  <div className="btn-container">
                    <button
                      to={`/${category}/${product._id}`}
                      className="btn"
                      onClick={() => navigate(`/${category}/${product._id}`)}
                    >
                      הכירו את המוצר
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEdit(product._id)}
                        >
                          <Pencil className="mb-1" /> עריכה
                        </button>

                        <button onClick={() => handleDelete(product._id)}>
                          <Trash className="mb-1" /> מחיקה
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductListByCategory;
