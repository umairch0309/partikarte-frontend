import React from "react";
import "./FeeCompetition.scss";
import { ReactSVG } from "react-svg";
import PrimaryButton from "../UI/PrimaryButton";

const benefits = [
  "Investment report every month",
  "Free consultation with expert accountant",
  "Various tips will be given through the community",
  "Provide NFT purchase advice from our research ",
];

const FeeCompetition = () => {
  return (
    <div className="fee-competition-section-container">
      <div className="fee-competition-section-left">
        <div className="header">
          <p>Fee’s</p>
          <h1>
            No <span>Fee </span>Competition
          </h1>
        </div>
        <div className="right-section-bottom">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop.
          </p>
          <PrimaryButton>Customize Pricing</PrimaryButton>
        </div>
      </div>
      <div className="fee-competition-section-right">
        <img src="/images/fee-image.svg" />
      </div>
    </div>
  );
};

export default FeeCompetition;
