import React from "react";
import { ReactSVG } from "react-svg";
import "./Header.scss";
import { Link } from "react-router-dom";
import PrimaryButton from "../../UI/PrimaryButton";

const Header = () => {
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
          <Link className="login-link-button" to="/business/login">
            <PrimaryButton className="header-login-button">Login</PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
