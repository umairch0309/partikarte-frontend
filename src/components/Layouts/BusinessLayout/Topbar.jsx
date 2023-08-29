import React, { useState } from "react";
import "./Topbar.scss";
import { ReactSVG } from "react-svg";
import { Drawer, Skeleton } from "antd";
import { businessRoutes } from "../../../Routes";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/auth-context";
import { useProfileDetails } from "../../../api/profile";

const Topbar = ({ title, subtitle }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { iisLoggedIn, setIsLoggedIn, user, setUser } = useAuthContext();

  const { isLoading } = useProfileDetails((res) => {
    if (res?.data) {
      setUser(res?.data);
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

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
          <h5>
            {location?.pathname === "/business/dashboard"
              ? `Hey ${
                  user?.user?.name ||
                  user?.business?.company?.companyName?.split(" ")[0] ||
                  "User"
                }, Good Evening 🌃`
              : subtitle}
          </h5>
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
            <ReactSVG
              className="notifications-icon"
              src="/icons/tools/notification.svg"
            />
            {!isLoading ? (
              <img
                onClick={() => navigate("/business/settings")}
                src={user?.user?.profile_image || "/images/event-1.jpg"}
              />
            ) : (
              <Skeleton.Avatar active={true} size={60} shape={"circle"} />
            )}

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
                <NavLink
                  key={route.title}
                  className="single-sidebar-item"
                  to={route.route}
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
        </div>
      </Drawer>
    </>
  );
};

export default Topbar;
