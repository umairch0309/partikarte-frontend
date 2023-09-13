import React from "react";
import "./SecondaryButton.scss";

const SecondaryButton = ({ onClick, className, children, type, disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`secondary-button ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
