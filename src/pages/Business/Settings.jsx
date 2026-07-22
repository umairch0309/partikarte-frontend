import React from "react";
import "./Settings.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import { Link, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ReactSVG } from "react-svg";
import CompanyInformation from "../../components/BusinessSettings/CompanyInformation";
import FinanceInformation from "../../components/BusinessSettings/FinanceInformation";
import MarketingInformation from "../../components/BusinessSettings/MarketingInformation";
import AccountInformation from "../../components/BusinessSettings/AccountInformation";
import { useAuthContext } from "../../context/auth-context";
import usePermissionCheck from "../../hooks/usePermissionCheck";
import { useStripeConnectStatus } from "../../hooks/useStripeConnectStatus";

const Settings = () => {
  const location = useLocation();
  const { checkPermission } = usePermissionCheck();
  const { setIsLoggedIn } = useAuthContext();
  const { isStripeReady, isLoading } = useStripeConnectStatus();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const stripeLocked = !isLoading && !isStripeReady;

  return (
    <div className="business-settings-page">
      <Topbar title={"Settings"} subtitle={"Easily change your information."} />
      <div className="business-settings-main-container">
        <aside className="business-settings-left">
          <h3>Update And Manage Your Account</h3>
          <div className="business-settings-menu">
            {!stripeLocked &&
              checkPermission("settingsCompanyInfo").status && (
                <Link
                  to="/business/settings"
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
              )}
            {checkPermission("settingsFinanceInfo").status && (
              <NavLink to="/business/settings/finance" end>
                <ReactSVG src="/icons/menu/finance-dollar.svg" />
                <span>Finance</span>
              </NavLink>
            )}
            {!stripeLocked &&
              checkPermission("settingsMarketingInfo").status && (
                <NavLink to="/business/settings/marketing" end>
                  <ReactSVG src="/icons/menu/marketing.svg" />
                  <span>Marketing & API</span>
                </NavLink>
              )}
            {!stripeLocked &&
              checkPermission("settingsAccountInfo").status && (
                <NavLink to="/business/settings/account" end>
                  <ReactSVG src="/icons/menu/user-square.svg" />
                  <span>Account</span>
                </NavLink>
              )}
            <button onClick={handleLogout} className="logout-button-settings">
              Logout
            </button>
          </div>
        </aside>
        <div className="business-settings-right">
          <Routes>
            {stripeLocked ? (
              <>
                <Route path="finance" element={<FinanceInformation />} />
                <Route
                  path="*"
                  element={<Navigate to="/business/settings/finance" replace />}
                />
              </>
            ) : (
              <>
                {checkPermission("settingsCompanyInfo").status && (
                  <Route index element={<CompanyInformation />} />
                )}
                {checkPermission("settingsFinanceInfo").status && (
                  <Route path="finance" element={<FinanceInformation />} />
                )}
                {checkPermission("settingsMarketingInfo").status && (
                  <Route path="marketing" element={<MarketingInformation />} />
                )}
                {checkPermission("settingsAccountInfo").status && (
                  <Route path="account" element={<AccountInformation />} />
                )}
              </>
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Settings;
