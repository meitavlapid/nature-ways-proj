import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../src/services/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (password !== confirm) {
      setMsg("הסיסמאות לא תואמות");
      return;
    }

    try {
      const res = await api.post(`/api/auth/reset-password/${token}`, {
        password,
      });
      setMsg("הסיסמה עודכנה בהצלחה");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.msg || "שגיאה באיפוס הסיסמה");
    }
  };

  return (
    <div className="container mt-5" dir="rtl" style={{ maxWidth: "400px" }}>
      <h3 className="mb-3">איפוס סיסמה</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="סיסמה חדשה"
          className="form-control mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="אישור סיסמה"
          className="form-control mb-3"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-success w-100">
          אפס סיסמה
        </button>
      </form>
      {msg && <div className="alert alert-info mt-3">{msg}</div>}
    </div>
  );
}

export default ResetPassword;
