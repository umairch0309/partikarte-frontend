import React from "react";
import "./BecomeAPartner.scss";
import { ReactSVG } from "react-svg";
import PrimaryButton from "../UI/PrimaryButton";

const BecomeAPartner = () => {
  return (
    <div className="become-a-partner-section">
      <div className="become-a-partner-left">
        <div className="header">
          <p>Opportunities!</p>
          <h1>
            Become <span>Partner!</span>
          </h1>
        </div>
        <div className="section-bottom">
          <p>
            We are a company that will monitor the price movements of your NFT
            with our expert accountants. We will provide some direction
            regarding your purchase.
          </p>
          <p>
            We believe the power of our accountants can help you in developing
            your investment. We also have a designer to determine which art is
            worth buying.
          </p>
          <h5>Join and entrust your financial development to us.</h5>
        </div>
        <PrimaryButton className="get-started-button">
          Get Started
        </PrimaryButton>
      </div>
      <div className="become-a-partner-right">
        <img src="/images/partner-image.png" />
      </div>
    </div>
  );
};

export default BecomeAPartner;
