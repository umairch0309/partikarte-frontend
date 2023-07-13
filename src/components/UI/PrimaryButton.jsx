import React from "react";
import "./PrimaryButton.scss";

const PrimaryButton = ({ onClick, className, children, type, disabled }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`primary-button ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
