import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import { Link } from "react-router-dom";

function Admin() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="container mt-5" dir="rtl">
      <h2 className="mb-4">ניהול המערכת</h2>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">ניהול מוצרים</h5>
              <p className="card-text">צפייה, עריכה והוספה של מוצרים.</p>
              <Link to="/admin/products" className="btn btn-primary mt-auto">
                לניהול מוצרים
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">משתמשים רשומים</h5>
              <p className="card-text">צפייה וניהול משתמשים רשומים.</p>
              <Link to="/admin/users" className="btn btn-secondary mt-auto">
                לניהול משתמשים
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">ניהול סרטונים</h5>
              <p className="card-text">הוספה ומחיקה של סרטונים לעמוד הבית.</p>
              <Link to="/admin/videos" className="btn btn-success mt-auto">
                לניהול סרטונים
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
