import React, { useEffect, useState } from "react";
import api from "../src/services/api";
import { useUser } from "../hooks/UserContext";
import "../css/AdminUsers.css";
import { Trash, ShieldLock } from "react-bootstrap-icons";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("users");
  const [registered, setRegistered] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("שגיאה בטעינת משתמשים:", err.message);
    }
  };

  const fetchRegistered = async () => {
    try {
      const res = await api.get("/api/register/all", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setRegistered(res.data);
    } catch (err) {
      console.error("שגיאה בטעינת נרשמים:", err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRegistered();
  }, []);

  const handleDelete = async (id) => {
    if (user._id === id) return alert("לא ניתן למחוק את עצמך");
    if (!window.confirm("למחוק את המשתמש?")) return;
    try {
      await api.delete(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      fetchUsers();
    } catch (err) {
      alert("שגיאה במחיקה");
    }
  };

  const handleToggleAdmin = async (id, isAdminNow) => {
    try {
      await api.put(
        `/api/users/${id}/role`,
        { role: isAdminNow ? "user" : "admin" },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      alert("שגיאה בשינוי תפקיד");
      console.error(err.message);
    }
  };

  return (
    <div className="admin-users container" dir="rtl">
      <h2>ניהול משתמשים</h2>
      {users.length === 0 ? (
        <p>לא נמצאו משתמשים.</p>
      ) : (
        <div className="user-list">
          {users.map((u) => (
            <div className="user-card" key={u._id}>
              <h4>{u.name}</h4>
              <p>
                <strong>אימייל:</strong> {u.email}
              </p>
              <p>
                <strong>טלפון:</strong> {u.phone || "לא צויין"}
              </p>
              <p>
                <strong>תפקיד:</strong> {u.role === "admin" ? "אדמין" : "משתמש"}
              </p>
              <p>
                <strong>תחומי עניין:</strong>
              </p>
              <div className="tag-list">
                {u.interests?.map((tag, idx) => (
                  <span key={idx} className="tag">
                    {tag}
                  </span>
                )) || <span>לא נבחרו</span>}
              </div>

              <div className="actions">
                {u._id !== user._id && (
                  <>
                    <button
                      className="btn-admin"
                      onClick={() =>
                        handleToggleAdmin(u._id, u.role === "admin")
                      }
                    >
                      <ShieldLock className="mb-1" />
                      {u.role === "admin" ? "הסר אדמין" : "הפוך לאדמין"}
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(u._id)}
                    >
                      <Trash className="mb-1" /> מחיקה
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
