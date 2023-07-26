import React from "react";
import { Route, Routes } from "react-router-dom";
import SignIn from "./SignIn";
import Page404 from "../common/Page404";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import BusinessLayout from "../../components/Layouts/BusinessLayout/BusinessLayout";

const BusinessMain = () => {
  const isLoggedIn = true;
  return (
    <>
      {!isLoggedIn && (
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      )}
      {isLoggedIn && (
        <BusinessLayout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BusinessLayout>
      )}
    </>
  );
};

export default BusinessMain;
