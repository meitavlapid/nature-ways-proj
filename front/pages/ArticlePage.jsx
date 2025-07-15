import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../src/services/api";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import "../css/ArticlePage.css";

function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();
  useEffect(() => {
    api
      .get(`/api/articles/${id}`)
      .then((res) => setArticle(res.data))
      .catch((err) => console.error("שגיאה בטעינת מאמר:", err));
  }, [id]);

  if (!article) return <p>טוען מאמר...</p>;

  return (
    <div className="article-page">
      <h1>{article.title}</h1>

      <p className="summary">{article.summary}</p>

      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="article-image"
        />
      )}

      {article.sections?.map((section, idx) => (
        <div key={idx} className="article-section">
          <h3>{section.subtitle}</h3>
          <p>{section.paragraph}</p>
        </div>
      ))}

      <div className="article-conclusion">
        <h4>סיכום</h4>
        <p>{article.conclusion}</p>
      </div>

      <div className="article-biblio">
        <h4>ביבליוגרפיה</h4>
        <p>{article.bibliography}</p>
      </div>

      {article.tags?.length > 0 && (
        <div className="article-tag">
          <h4>תגיות</h4>
          {article.tags.map((tag, idx) => (
            <span key={idx} className="tag-label">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="article-buttons">
        <button onClick={() => navigate("/articles")} className="btn back-btn">
          חזרה לרשימת מאמרים
        </button>

        {user?.role === "admin" && (
          <button
            onClick={() => navigate(`/articles/edit/${article._id}`)}
            className="btn edit-btn"
          >
            עריכת מאמר
          </button>
        )}
      </div>
    </div>
  );
}

export default ArticlePage;
