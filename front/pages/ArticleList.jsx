import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../src/services/api";
import { useUser } from "../hooks/UserContext";
import { Pencil, Trash } from "react-bootstrap-icons";

import "../css/ArticleList.css";

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [searchTag, setSearchTag] = useState("");
  const { user, isAdmin } = useUser();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    api
      .get("/api/articles")
      .then((res) => setArticles(res.data))
      .catch((err) => console.error("שגיאה בטעינת מאמרים:", err));
  }, []);
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showModal]);

  const filtered = searchTag
    ? articles.filter((a) =>
        a.tags?.some((t) => t.toLowerCase().includes(searchTag.toLowerCase()))
      )
    : articles;

  const handleDelete = async (id) => {
    if (!window.confirm("האם את בטוחה שברצונך למחוק את המאמר?")) return;
    try {
      await api.delete(`/api/articles/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("שגיאה במחיקת מאמר:", err);
      alert("שגיאה במחיקה");
    }
  };

  const handleEdit = (id) => {
    navigate(`/articles/edit/${id}`);
  };

  return (
    <div className="article-list">
      <h2>מאמרים</h2>

      <input
        type="text"
        placeholder="חיפוש לפי תגית..."
        value={searchTag}
        onChange={(e) => setSearchTag(e.target.value)}
        className="tag-search"
      />

      {isAdmin && (
        <div className="text-end mb-3">
          <button
            className="btn btn-success"
            onClick={() => navigate("/addarticles")}
          >
            הוסף מאמר
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <p>לא נמצאו מאמרים</p>
      ) : (
        <ul>
          <div className="article-grid">
            {filtered.map((article) => (
              <div className="article-card" key={article._id}>
                <div className="article-tags">
                  {article.tags?.map((tag, idx) => (
                    <span key={idx}>{tag}</span>
                  ))}
                </div>
                <img src={article.image} alt={article.title} />
                <div className="article-card-content">
                  <h4>{article.title}</h4>
                  <p>{article.summary}</p>
                  <div className="btn-container">
                    <Link
                      to={`/articles/${article._id}`}
                      className="btn"
                      onClick={(e) => {
                        if (!user) {
                          e.preventDefault();
                          setShowModal(true);
                        }
                      }}
                    >
                      לצפייה
                    </Link>
                    {showModal && (
                      <div
                        className={`custom-modal-backdrop ${
                          showModal ? "show" : ""
                        }`}
                      >
                        <div className="custom-modal">
                          <h5>לצפייה במאמרים יש להתחבר או להירשם</h5>
                          <div className="modal-actions">
                            <button
                              className="btn btn-success"
                              onClick={() => navigate("/login")}
                            >
                              התחברות
                            </button>
                            <button
                              className="btn btn-warning"
                              onClick={() => navigate("/register")}
                            >
                              הרשמה
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
                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEdit(article._id)}
                        >
                          <Pencil className="mb-1" /> עריכה
                        </button>

                        <button onClick={() => handleDelete(article._id)}>
                          <Trash className="mb-1" /> מחיקה
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
}

export default ArticleList;
