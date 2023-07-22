import React from "react";
import "./Benefits.scss";
import { ReactSVG } from "react-svg";

const benefits = [
  "Investment report every month",
  "Free consultation with expert accountant",
  "Various tips will be given through the community",
  "Provide NFT purchase advice from our research ",
];

const Benefits = () => {
  return (
    <div className="benefits-section-container">
      <div className="benefits-section-left">
        <ReactSVG src="/images/benefits-image.svg" />
      </div>
      <div className="benefits-section-right">
        <div className="header">
          <p>The Benefits</p>
          <h1>
            What will you <span>get</span>?
          </h1>
        </div>
        <div className="right-section-bottom">
          {benefits.map((e) => {
            return (
              <div className="benefit-item-container">
                <div className="item-main">
                  <ReactSVG src="/icons/tools/checked-circle.svg" />
                  <h4>{e}</h4>
                </div>
                <hr />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Benefits;
