import React, { useState } from "react";
import "../css/Contact.css";
import axios from "axios";
import api from "../src/services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/contact", formData);
      console.log("Form submitted:", formData);
      setStatus("success");
      alert("ההודעה נשלחה בהצלחה!");
      setFormData({ fullname: "", phone: "", email: "", message: "" });
    } catch (err) {
      console.error("שגיאה בשליחת הטופס:", err);
      setStatus("error");
    }
  };

  return (
    <div className="container-fluid">
      <h1>צור קשר</h1>
      <div className="contact-container">
      <p>
        נשמח לשמוע מכם! <br />אם יש לכם שאלות, בקשות או שתרצו להזמין מוצרים במיתוג
        אישי <br /> אנחנו כאן בשבילכם.
      </p>

      <form onSubmit={handleSubmit} className="contact-form">
        <label htmlFor="fullname">שם מלא:</label>
        <input
          type="text"
          name="fullname"
          id="fullname"
          value={formData.fullname}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">טלפון:</label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">אימייל:</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="message">הודעה:</label>
        <textarea
          name="message"
          id="message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <div className="btn-container">
          <button type="submit">בואו נדבר</button>
          {status === "success" && (
            <p className="success-message">ההודעה נשלחה בהצלחה!</p>
          )}
          {status === "error" && (
            <p className="error-message">אירעה שגיאה. נסה שוב מאוחר יותר.</p>
          )}
        </div>
      </form>
      <div className="contact-info">
        <p>
          
          נייצ’ר וויז – פתרונות מהטבע | השקדים 1, קרית טבעון | ח"פ: 516020898
        </p>
      </div></div>
    </div>
  );
};

export default Contact;
