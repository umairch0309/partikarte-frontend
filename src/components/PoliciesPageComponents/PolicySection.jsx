import React from "react";
import "./PolicySection.scss";
import SingleItem from "./SingleItem";

const PolicySection = ({ title }) => {
  return (
    <div className="policy-section-container">
      <h2 className="policy-section-heading">{title}</h2>
      <div className="policy-items-container">
        <SingleItem /> <SingleItem /> <SingleItem /> <SingleItem />
        <SingleItem /> <SingleItem />
      </div>
    </div>
  );
};

export default PolicySection;
