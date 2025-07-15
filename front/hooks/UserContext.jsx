import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ ...decoded, token });
      } catch (err) {
        console.error("טוקן לא תקין", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem("token", token);
      setUser({ ...decoded, token });
    } catch (err) {
      console.error("שגיאה בפענוח טוקן", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <UserContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export default UserProvider;