import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import api from "../src/services/api";
import Loader from "./Loader";
import "../css/ProductPage.css";

function ProductPage() {
  const { id, category } = useParams();
  const [product, setProduct] = useState(null);
  const { isAdmin, user } = useUser();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    api
      .get(`/api/products/${id}?category=${category}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error("שגיאה בקבלת פרטי מוצר:", err.message);
        alert("המוצר לא נמצא");
        navigate(`/${category}`);
      });
  }, [id, category, navigate]);

  if (!product) return <Loader />;

  return (
    <div className="container-fluid" dir="rtl">
      <div className="product-bg">
        <div className="product-buttons">
          <div>
            <button
              className="btn btn-secondary me-2"
              onClick={() => navigate(-1)}
            >
              חזרה
            </button>
            {isAdmin && (
              <button
                className="btn btn-warning"
                onClick={() =>
                  navigate(`/admin/edit/${product._id}?category=${category}`)
                }
              >
                עריכת מוצר
              </button>
            )}
            {product.specFileUrl && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!user && !isAdmin) {
                    setShowModal(true);
                  } else {
                    window.open(product.specFileUrl, "_blank");
                  }
                }}
              >
                הורדת המפרט שלי
              </button>
            )}
            {showModal && (
              <div className="custom-modal-backdrop">
                <div className="custom-modal ">
                  <h3>כדי להוריד את המפרט, יש להירשם</h3>
                  <div className="modal-actions">
                    <button
                      className="btn btn-success"
                      onClick={() => navigate("/register")}
                    >
                      להרשמה
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="product-text">
          <h2 className=" text-center">{product.name}</h2>
          <p className="lead text-muted">{product.shortDescription}</p>
          <img src={product.image} alt={product.name} className="img" />
          <div>
            <h5>תיאור מלא:</h5>
            <p>{product.fullDescription}</p>

            {product.mechanism?.length > 0 && (
              <>
                <h5>מנגנון פעולה:</h5>
                <ul>
                  {product.mechanism.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {product.activeIngredients?.length > 0 && (
              <>
                <h5>רכיבים פעילים:</h5>
                <ul>
                  {product.activeIngredients.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {product.instructions?.length > 0 && (
              <>
                <h5>המלצות שימוש:</h5>
                <ul>
                  {product.instructions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {product.suitableFor?.length > 0 && (
              <>
                <h5>למי זה מתאים:</h5>
                <ul>
                  {product.suitableFor.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {product.sections?.length > 0 && (
              <>
                <h5>מידע נוסף:</h5>
                {product.sections.map((section, i) => (
                  <div key={i} className="mb-3">
                    <h6>{section.title}</h6>
                    <ul>
                      {section.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
