import React from "react";
import "../css/Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">טוען...</span>
      </div>
    </div>
  );
};

export default Loader;
