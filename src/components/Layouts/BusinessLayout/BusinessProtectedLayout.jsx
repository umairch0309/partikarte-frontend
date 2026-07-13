import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../../../context/auth-context";
import BusinessLayout from "./BusinessLayout";

const BusinessProtectedLayout = () => {
  const { isLoggedIn } = useAuthContext();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/business/login" replace state={{ from: location }} />;
  }

  return (
    <BusinessLayout>
      <Outlet key={location.pathname} />
    </BusinessLayout>
  );
};

export default BusinessProtectedLayout;
