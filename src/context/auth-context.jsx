import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(token !== null);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [user, setUser] = useState(null);
  const [forgotEmail, setForgotEmail] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{
        setRole,
        role,
        setToken,
        token,
        setIsLoggedIn,
        isLoggedIn,
        setUser,
        user,
        setForgotEmail,
        forgotEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

export const useAuthContext = () => {
  return useContext(AuthContext);
};
