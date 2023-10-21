import React, { createContext, useState, useEffect, useContext } from "react";
import { getDecryptedData } from "../utilities/EncryptedStorage";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getDecryptedData("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(token !== null);
  const [role, setRole] = useState(getDecryptedData("role"));
  const [user, setUser] = useState(null);
  const [forgotEmail, setForgotEmail] = useState(null);
  const [permissions, setPermissions] = useState(
    getDecryptedData("available") || []
  );

  useEffect(() => {
    setToken(getDecryptedData("token"));
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
