import React from "react";
import "./Sidebar.scss";
import { ReactSVG } from "react-svg";
import { businessRoutes } from "../../../Routes";
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../../../context/auth-context";
import usePermissionCheck from "../../../hooks/usePermissionCheck";

const Sidebar = ({ stripeGateActive = false }) => {
  const { setIsLoggedIn } = useAuthContext();
  const { checkPermission } = usePermissionCheck();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("available");
    setIsLoggedIn(false);
  };

  return (
    <aside className="side-bar-main-container">
      <Link to="/" className="sidebar-logo-link" aria-label="Go to landing page">
        <ReactSVG src="/blue-logo.svg" />
      </Link>
      {stripeGateActive && (
        <p className="sidebar-stripe-lock-note">
          Connect Stripe to unlock the full dashboard
        </p>
      )}
      <div className="sidebar-all-routes-container">
        {businessRoutes.map((route) => {
          const allowed = checkPermission(route.route.split("/").pop()).status;
          if (!allowed) return null;

          const isSettings = route.route.startsWith("/business/settings");
          const locked = stripeGateActive && !isSettings;

          if (locked) {
            return (
              <div
                key={route.title}
                className="single-sidebar-item sidebar-item-locked"
                title="Connect your Stripe account first"
              >
                <ReactSVG src={route.icon} />
                <h5>{route.title}</h5>
              </div>
            );
          }

          return (
            <NavLink
              key={route.title}
              className="single-sidebar-item"
              to={
                stripeGateActive && isSettings
                  ? "/business/settings/finance"
                  : route.route
              }
            >
              <ReactSVG src={route.icon} />
              <h5>{route.title}</h5>
            </NavLink>
          );
        })}
      </div>
      <div onClick={handleLogout} className="logout-button">
        <ReactSVG src={"/icons/menu/logout-icon.svg"} />
        <h5>Logout</h5>
      </div>
    </aside>
  );
};

export default Sidebar;
