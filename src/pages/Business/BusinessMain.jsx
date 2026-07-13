import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SignIn from "./Auth/SignIn";
import SignUp from "./Auth/SignUp";
import ForgotPassword from "./Auth/ForgotPassword";
import VerifyOTP from "./Auth/VerifyOTP";
import ResetPassword from "./Auth/ResetPassword";
import { useAuthContext } from "../../context/auth-context";

const BusinessMain = () => {
  const { isLoggedIn, forgotEmail } = useAuthContext();
  const location = useLocation();

  if (isLoggedIn) {
    const redirectTo =
      location.state?.from?.pathname || "/business/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <Routes>
      <Route path="/business/login" element={<SignIn />} />
      <Route path="/business/signup" element={<SignUp />} />
      <Route path="/business/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/business/verify-otp"
        element={
          forgotEmail ? (
            <VerifyOTP />
          ) : (
            <Navigate to="/business/forgot-password" replace />
          )
        }
      />
      <Route
        path="/business/reset-password"
        element={
          forgotEmail ? (
            <ResetPassword />
          ) : (
            <Navigate to="/business/forgot-password" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/business/login" replace />} />
    </Routes>
  );
};

export default BusinessMain;
