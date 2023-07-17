import React from "react";
import "./Footer.scss";
import { ReactSVG } from "react-svg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer-user-layout">
      <Link to="/">
        <ReactSVG src="/logo.svg" />
      </Link>
      <div className="footer-links">
        <Link to="/policies">Policies</Link>
        <Link to="/contact-us">Contact us</Link>
        <Link to="/about-us">About us</Link>
      </div>
      <hr />
      <div className="footer-copy-links">
        <p>Copyright © 2023 partikarte. All Rights Reserved.</p>
        <div className="footer-social-links">
          <a href="#">
            <ReactSVG src="/icons/tools/facebook-footer.svg" target="_blank" />
          </a>
          <a href="#">
            <ReactSVG src="/icons/tools/linkedin-footer.svg" target="_blank" />
          </a>
          <a href="#">
            <ReactSVG src="/icons/tools/twitter-footer.svg" target="_blank" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
