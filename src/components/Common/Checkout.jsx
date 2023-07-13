import React from "react";
import { ReactSVG } from "react-svg";
import "./Checkout.scss";

import PrimaryButton from "../UI/PrimaryButton";
import { useState } from "react";

const Checkout = () => {
  const [activePaymentType, setActivePaymentType] = useState("card");
  return (
    <div className="checkout-component">
      <h2 className="checkout-title">Payment Checkout</h2>
      <div className="top-payment-buttons">
        <PrimaryButton
          onClick={() => setActivePaymentType("card")}
          className={`top-payment-button ${
            activePaymentType !== "card" && "in-active-button"
          }`}
        >
          <ReactSVG src="/icons/tools/card-payment.svg" />
          Credit Card
        </PrimaryButton>
        <PrimaryButton
          onClick={() => setActivePaymentType("bank")}
          className={`top-payment-button ${
            activePaymentType !== "bank" && "in-active-button"
          }`}
        >
          <ReactSVG src="/icons/tools/bank-payment.svg" />
          Bank Transfer
        </PrimaryButton>
      </div>
    </div>
  );
};

export default Checkout;
