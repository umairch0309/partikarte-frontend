import React from "react";
import "./Topbar.scss";
import { ReactSVG } from "react-svg";

const Topbar = ({ title, subtitle }) => {
  return (
    <header className="topbar-container">
      <div className="topbar-left">
        <h2>{title}</h2>
        <h5>{subtitle}</h5>
      </div>
      <div className="topbar-right">
        <div className="search-input-container">
          <input type="text" placeholder="Search anything here..." />
          <ReactSVG src="/icons/tools/search.svg" />
        </div>
        <ReactSVG src="/icons/tools/notification.svg" />
        <img src="/images/business-profile.jpg" />
      </div>
    </header>
  );
};

export default Topbar;
