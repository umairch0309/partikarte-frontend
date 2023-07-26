import React from "react";
import "./BusinessLayout.scss";
import Sidebar from "./Sidebar";

const BusinessLayout = ({ children }) => {
  return (
    <div className="business-layout-container">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

export default BusinessLayout;
