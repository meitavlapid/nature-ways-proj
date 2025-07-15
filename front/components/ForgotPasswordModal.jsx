import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../src/services/api";

function ForgotPasswordModal({ show, onClose }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSend = async () => {
    try {
      const res = await api.post("/api/auth/forgot-password", { email });
      setMsg("אם האימייל קיים – נשלח קישור לאיפוס הסיסמה.");
    } catch (err) {
      setMsg("שגיאה בשליחה. נסה שוב.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered dir="rtl">
      <Modal.Header closeButton>
        <Modal.Title>שחזור סיסמה</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="email"
          placeholder="הכנס את האימייל שלך"
          className="form-control mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {msg && <div className="alert alert-info">{msg}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          סגור
        </Button>
        <Button variant="primary" onClick={handleSend}>
          שלח קישור לאיפוס
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ForgotPasswordModal;
