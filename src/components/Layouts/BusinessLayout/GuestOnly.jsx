import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../../context/auth-context";

const GuestOnly = ({ children }) => {
  const { isLoggedIn } = useAuthContext();
  const location = useLocation();

  if (isLoggedIn) {
    const redirectTo =
      location.state?.from?.pathname || "/business/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default GuestOnly;
