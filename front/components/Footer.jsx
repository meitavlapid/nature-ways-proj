import React from "react";
import { FaFacebook, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import "../css/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-right">
        <a
          href="https://www.facebook.com/share/1AWNNFq387/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook className="facebook-icon" />
        </a>
        <a
          href="https://wa.me/972558829222?text=היי%20אני%20פונה%20אלייך%20דרך%20אתר%20נייצר%20וויז"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="whatsapp-icon" />
        </a>
        <Link to="/contact">
          <FaEnvelope className="email-icon" />
        </Link>
      </div>

      <div className="footer-center">
        <img
          src="https://res.cloudinary.com/dt5nnq3ew/image/upload/v1750344062/logo_ul47xl.png"
          alt="לוגו האתר"
        />
      </div>

      <div className="footer-left">
        <p>© כל הזכויות שמורות</p>

        <Link to="/">האתר נבנה ע"י ML</Link>
      </div>
    </footer>
  );
}

export default Footer;
