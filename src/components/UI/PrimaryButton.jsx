import React from "react";
import "./PrimaryButton.scss";

const PrimaryButton = ({
  onClick,
  className,
  children,
  type,
  disabled,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`primary-button ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
