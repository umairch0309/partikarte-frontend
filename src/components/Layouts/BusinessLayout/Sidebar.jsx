import React from "react";
import "./Sidebar.scss";
import { ReactSVG } from "react-svg";
import { businessRoutes } from "../../../Routes";
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../../../context/auth-context";
import usePermissionCheck from "../../../hooks/usePermissionCheck";

const Sidebar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuthContext();
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
      <div className="sidebar-all-routes-container">
        {businessRoutes.map((route) => {
          return checkPermission(route.route.split("/").pop()).status ? (
            <NavLink
              key={route.title}
              className="single-sidebar-item"
              to={route.route}
            >
              <ReactSVG src={route.icon} />
              <h5>{route.title}</h5>
            </NavLink>
          ) : null;
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
