import React from "react";
import { ReactSVG } from "react-svg";
import "./Header.scss";
import SecondaryButton from "../../UI/SecondaryButton";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="user-layout-header-container">
      <div className="user-layout-header">
        <Link to="/">
          <ReactSVG className="header-logo" src="/logo-white.svg" />
        </Link>
        <div className="header-right-side">
          <h4>For Organizers</h4>
          <Link to="/business/login">
            <SecondaryButton className="header-login-button">
              Login
            </SecondaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
