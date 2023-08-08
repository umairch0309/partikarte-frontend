import React, { useEffect, useState } from "react";
import "./Settings.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { ReactSVG } from "react-svg";
import CompanyInformation from "../../components/BusinessSettings/CompanyInformation";
import FinanceInformation from "../../components/BusinessSettings/FinanceInformation";
import MarketingInformation from "../../components/BusinessSettings/MarketingInformation";
import AccountInformation from "../../components/BusinessSettings/AccountInformation";

const Settings = () => {
  const location = useLocation();
  return (
    <div className="business-settings-page">
      <Topbar
        title={"Settings"}
        subtitle={"Customise your application based upon need!"}
      />
      <div className="business-settings-main-container">
        <aside className="business-settings-left">
          <h3>Update And Manage Your Account</h3>
          <div className="business-settings-menu">
            <Link
              to={"./"}
              className={
                location.pathname === "/business/settings" ||
                location.pathname === "/business/settings/"
                  ? "active"
                  : ""
              }
            >
              <ReactSVG src="/icons/menu/company.svg" />
              <span>Company</span>
            </Link>
            <NavLink to={"./finance"}>
              <ReactSVG src="/icons/menu/finance-dollar.svg" />
              <span>Finance</span>
            </NavLink>
            <NavLink to={"./marketing"}>
              <ReactSVG src="/icons/menu/marketing.svg" />
              <span>Marketing</span>
            </NavLink>
            <NavLink to={"./account"}>
              <ReactSVG src="/icons/menu/user-square.svg" />
              <span>Account</span>
            </NavLink>
            <button className="logout-button-settings">Logout</button>
          </div>
        </aside>
        <div className="business-settings-right">
          <Routes>
            <Route index element={<CompanyInformation />} />
            <Route path="/finance" element={<FinanceInformation />} />
            <Route path="/marketing" element={<MarketingInformation />} />
            <Route path="/account" element={<AccountInformation />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Settings;
