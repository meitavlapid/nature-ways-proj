import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import { TbDoorEnter, TbDoorExit } from "react-icons/tb";
import { FaWhatsapp, FaUserCircle } from "react-icons/fa";
import "../css/Navbar.css";

function Navbar() {
  const { user } = useUser();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navRef = useRef();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <nav className="navbar sticky-top" ref={navRef}>
      <div className="logo">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dt5nnq3ew/image/upload/v1750344062/logo_ul47xl.png"
            alt="לוגו האתר"
          />
        </Link>
      </div>

      <button className="burger" onClick={toggleMenu} aria-label="תפריט">
        ☰
      </button>

      <div className={`nav-center ${menuOpen ? "open" : ""}`}>
        <ul>
          <li className="dropdown">
            <span onClick={() => setDropdownOpen((prev) => !prev)}>מוצרים</span>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                {[
                  ["פסוריאזיס", "/psoriasis"],
                  ["אנטי אייג'ינג", "/antiaging"],
                  ["אקנה", "/acne"],
                  ["פיגמנטציה", "/pigmentation"],
                  ["התקרחות", "/hairloss"],
                  ["שיקום העור", "/rehabilitation"],
                  ["הרזייה וחיטוב", "/weightloss"],
                  ["פיתוח אישי", "/customdevelopment"],
                ].map(([label, path]) => (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={() => {
                        setDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <Link to="/articles" onClick={() => setMenuOpen(false)}>
              תוכן ומחקר
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              אודות
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              צור קשר
            </Link>
          </li>
          {!user && (
            <li>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                הרשמה
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="nav-icons">
        <a
          href="https://wa.me/972558829222?text=היי%20אני%20פונה%20אלייך%20דרך%20אתר%20נייצר%20וויז"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp color="#25D366" />
        </a>

        {!user && (
          <Link to="/login" title="התחברות" onClick={() => setMenuOpen(false)}>
            <TbDoorEnter color="#333" />
          </Link>
        )}
        {user && (
          <>
            {user.role === "admin" && (
              <Link
                to="/admin"
                title="אזור אישי"
                onClick={() => setMenuOpen(false)}
              >
                <FaUserCircle color="#D7B98B" />
              </Link>
            )}
            <Link onClick={logout} title="התנתקות">
              <TbDoorExit color="#333" />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
