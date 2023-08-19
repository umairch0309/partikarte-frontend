import React, { useState } from "react";
import "./Topbar.scss";
import { ReactSVG } from "react-svg";
import useIsMobileWidth from "../../../hooks/useIsMobileWidth";
import { Drawer } from "antd";
import { businessRoutes } from "../../../Routes";
import { NavLink, useNavigate } from "react-router-dom";

const Topbar = ({ title, subtitle }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <header className="topbar-container">
        <div className="search-input-container">
          <input type="text" placeholder="Search anything here..." />
          <ReactSVG src="/icons/tools/search.svg" />
        </div>

        <div className="topbar-left">
          <h2>{title}</h2>
          <h5>{subtitle}</h5>
        </div>
        <div className="topbar-right">
          <div className="search-input-container">
            <input type="text" placeholder="Search anything here..." />
            <ReactSVG src="/icons/tools/search.svg" />
          </div>

          <ReactSVG
            onClick={() => navigate("/")}
            className="mobile-top-bar-logo"
            src="/blue-logo.svg"
          />
          <div className="image-and-notification-container">
            <ReactSVG src="/icons/tools/notification.svg" />
            <img src="/images/business-profile.jpg" />

            <ReactSVG
              onClick={showDrawer}
              className="menu-icon-mobile"
              src="/icons/menu/dashboard-icon.svg"
            />
          </div>
        </div>
      </header>
      <Drawer
        placement={"left"}
        closable={true}
        onClose={onClose}
        open={open}
        width={`${window.screen.width * 0.8}px`}
        key={"right"}
        className="mobile-menu-drawer"
      >
        <div className="side-bar-mobile-main-container">
          <ReactSVG onClick={() => navigate("/")} src="/blue-logo.svg" />
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
        </div>
      </Drawer>
    </>
  );
};

export default Topbar;
