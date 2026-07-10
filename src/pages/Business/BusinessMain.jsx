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
import ViewEventBusiness from "./ViewEventBusiness";
import Customers from "./Customers";
import Invoices from "./Invoices";
import Finance from "./Finance";
import Roles from "./Roles";
import usePermissionCheck from "../../hooks/usePermissionCheck";

const BusinessMain = () => {
  const { isLoggedIn, forgotEmail } = useAuthContext();
  const { checkPermission, getFirstGrantedPermission } = usePermissionCheck();

  // If not logged in, show authentication-related routes
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="login" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route
          path="verify-otp"
          element={
            forgotEmail ? <VerifyOTP /> : <Navigate to="/business/forgot-password" replace />
          }
        />
        <Route
          path="reset-password"
          element={
            forgotEmail ? (
              <ResetPassword />
            ) : (
              <Navigate to="/business/forgot-password" replace />
            )
          }
        />

        {/* Show 404 for any other routes */}
        <Route path="*" element={<Navigate to="/business/login" />} />
      </Routes>
    );
  }

  return (
    <BusinessLayout>
      <Routes>
        {checkPermission("dashboard").status && (
          <Route path="/dashboard" index element={<Dashboard />} />
        )}
        {checkPermission("guestlists").status && (
          <Route path="/guestlists" element={<Guestlist />} />
        )}
        {checkPermission("settings").status && (
          <Route path="/settings/*" element={<Settings />} />
        )}
        {checkPermission("manage-events").status && (
          <Route path="/manage-events" element={<ManageEvents />} />
        )}
        {checkPermission("events").status && (
          <Route path="/view-event/:eventId" element={<ViewEventBusiness />} />
        )}
        {checkPermission("manage-tickets").status && (
          <Route path="/manage-tickets" element={<ManageTickets />} />
        )}
        {checkPermission("orders").status && (
          <Route path="/orders" element={<Orders />} />
        )}
        {checkPermission("finance").status && (
          <Route path="/finance" element={<Finance />} />
        )}
        {checkPermission("customers").status && (
          <Route path="/customers" element={<Customers />} />
        )}
        {checkPermission("invoices").status && (
          <Route path="/invoices" element={<Invoices />} />
        )}
        {checkPermission("ticket-scanning").status && (
          <Route path="/ticket-scanning" element={<TicketsScanning />} />
        )}
        {checkPermission("user-management").status && (
          <Route path="/user-management" element={<UserManagement />} />
        )}
        {checkPermission("roles").status && (
          <Route path="/roles" element={<Roles />} />
        )}
        {checkPermission("organizer-settings").status && (
          <Route path="/organizer-settings/*" element={<OrganizerSettings />} />
        )}

        {/* Show 404 for any other unauthorized routes */}
        <Route
          path="*"
          element={
            getFirstGrantedPermission()?.permission ? (
              <Navigate
                to={`/business/${
                  getFirstGrantedPermission()?.permission?.identifier
                }`}
              />
            ) : (
              <Page404 />
            )
          }
        />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BusinessLayout>
  );
};

export default BusinessMain;
