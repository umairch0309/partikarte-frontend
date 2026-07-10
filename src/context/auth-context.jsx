import React, { createContext, useState, useEffect, useContext } from "react";
import { getDecryptedData } from "../utilities/EncryptedStorage";

const AuthContext = createContext();

const FORGOT_EMAIL_KEY = "forgotEmail";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getDecryptedData("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(token !== null);
  const [role, setRole] = useState(getDecryptedData("role"));
  const [user, setUser] = useState(null);
  const [forgotEmail, setForgotEmailState] = useState(
    () => sessionStorage.getItem(FORGOT_EMAIL_KEY) || null
  );
  const [permissions, setPermissions] = useState(
    getDecryptedData("available") || []
  );

  const setForgotEmail = (email) => {
    if (email) {
      sessionStorage.setItem(FORGOT_EMAIL_KEY, email);
    } else {
      sessionStorage.removeItem(FORGOT_EMAIL_KEY);
    }
    setForgotEmailState(email);
  };

  useEffect(() => {
    setToken(getDecryptedData("token"));
  }, [isLoggedIn]);

  console.log(permissions);

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
        setPermissions,
        permissions,
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
