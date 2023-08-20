import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./Auth/SignIn";
import Page404 from "../common/Page404";
import SignUp from "./Auth/SignUp";
import Dashboard from "./Dashboard";
import BusinessLayout from "../../components/Layouts/BusinessLayout/BusinessLayout";
import ForgotPassword from "./Auth/ForgotPassword";
import VerifyOTP from "./Auth/VerifyOTP";
import ResetPassword from "./Auth/ResetPassword";
import Guestlist from "./Guestlist";
import Settings from "./Settings";
import ManageEvents from "./ManageEvents";
import ManageTickets from "./ManageTickets";
import Orders from "./Orders";
import TicketsScanning from "./TicketsScanning";
import UserManagement from "./UserManagement";
import OrganizerSettings from "./OrganizerSettings";
import { useAuthContext } from "../../context/auth-context";

const BusinessMain = () => {
  const { isLoggedIn } = useAuthContext();

  // If not logged in, show authentication-related routes
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<SignIn />} />
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
        <Route path="/dashboard" index element={<Dashboard />} />
        <Route path="/guestlists" element={<Guestlist />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route path="/manage-events" element={<ManageEvents />} />
        <Route path="/manage-tickets" element={<ManageTickets />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/ticket-scanning" element={<TicketsScanning />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/organizer-settings/*" element={<OrganizerSettings />} />

        {/* Show 404 for any other unauthorized routes */}
        <Route path="*" element={<Navigate to="/business/dashboard" />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BusinessLayout>
  );
};

export default BusinessMain;
