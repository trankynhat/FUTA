import React, { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    console.log("User data saved:", userData); // Kiểm tra thông tin người dùng khi đăng nhập thành công
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    console.log("User logged out"); // Kiểm tra khi người dùng đăng xuất
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
