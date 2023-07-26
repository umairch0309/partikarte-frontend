import React from "react";
import "./Sidebar.scss";
import { ReactSVG } from "react-svg";
import { businessRoutes } from "../../../Routes";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="side-bar-main-container">
      <ReactSVG src="/blue-logo.svg" />
      <div className="sidebar-all-routes-container">
        {businessRoutes.map((route) => {
          return (
            <NavLink className="single-sidebar-item" to={route.route}>
              <ReactSVG src={route.icon} />
              <h5>{route.title}</h5>
            </NavLink>
          );
        })}
      </div>
      <div className="logout-button">
        <ReactSVG src={"/icons/menu/logout-icon.svg"} />
        <h5>Logout</h5>
      </div>
    </aside>
  );
};

export default Sidebar;
