import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import "./Header.scss";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../../UI/PrimaryButton";
import { useAuthContext } from "../../../context/auth-context";
import { useProfileDetails } from "../../../api/profile";
import { Dropdown, Skeleton } from "antd";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthContext();
  const { isLoggedIn, setIsLoggedIn } = useAuthContext();

  const { isLoading } = useProfileDetails((res) => {
    if (res?.data) {
      setUser(res?.data);
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/business/login");
  };

  const items = [
    {
      label: (
        <div
          onClick={() => navigate("/business/dashboard")}
          className="button-in-dropdown"
        >
          <span>Dashboard</span>
        </div>
      ),
      key: "0",
      className: "blue-button-dropdown",
    },
    {
      label: (
        <div onClick={handleLogout} className="button-in-dropdown">
          <span>Logout</span>
        </div>
      ),
      key: "1",
      className: "red-button-dropdown",
    },
  ];
  return (
    <div className="user-layout-header-container">
      <div className="user-layout-header">
        <Link to="/">
          <ReactSVG className="header-logo" src="/logo-white.svg" />
        </Link>
        <div className="header-right-side">
          <Link to={"/join-business"}>
            <h4>For Organizers</h4>
          </Link>
          {!isLoggedIn ? (
            <Link className="login-link-button" to="/business/login">
              <PrimaryButton className="header-login-button">
                Login
              </PrimaryButton>
            </Link>
          ) : (
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
              placement="bottomRight"
              className="dropdown-table-actions"
            >
              {!isLoading ? (
                <img src={user?.user?.profile_image || "/images/event-1.jpg"} />
              ) : (
                <Skeleton.Avatar active={true} size={60} shape={"circle"} />
              )}
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
