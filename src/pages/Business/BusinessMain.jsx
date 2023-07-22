import React from "react";
import { Route, Routes } from "react-router-dom";
import SignIn from "./SignIn";
import Page404 from "../common/Page404";
import SignUp from "./SignUp";

const BusinessMain = () => {
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default BusinessMain;
