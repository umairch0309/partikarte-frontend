import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./SignIn";
import Page404 from "../common/Page404";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import BusinessLayout from "../../components/Layouts/BusinessLayout/BusinessLayout";
import ForgotPassword from "./ForgotPassword";
import VerifyOTP from "./VerifyOTP";
import ResetPassword from "./ResetPassword";

const BusinessMain = () => {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    setLoggedIn(localStorage.getItem("loggedIn"));
  });

  // If not logged in, show authentication-related routes
  if (!loggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<SignIn setLoggedIn={setLoggedIn} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Show 404 for any other routes */}
        <Route path="*" element={<Navigate to="/business/login" />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    );
  }

  return (
    <BusinessLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Show 404 for any other unauthorized routes */}
        <Route path="*" element={<Navigate to="/business/dashboard" />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BusinessLayout>
  );
};

export default BusinessMain;
