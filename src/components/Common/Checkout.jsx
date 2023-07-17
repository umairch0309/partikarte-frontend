import React, { useRef, useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { ReactSVG } from "react-svg";
import "./Checkout.scss";

import PrimaryButton from "../UI/PrimaryButton";
import { Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import StatusModal from "../UI/StatusModal";

const paymentFormInputStyle = {
  border: "1px solid #e6e9ed",
  borderRadius: "10px",
  fontSize: "15px",
  width: "100%",
  height: "50px",
  paddingInline: "16px",
  color: "#1d1e25",
  outlineColor: "#3d8aff",
};
const errorPaymentFormInputStyle = {
  outlineColor: "#3d8aff",
  border: "1px solid #e71d36",
};

const Checkout = ({ totalPrice }) => {
  const navigate = useNavigate();
  const [showSuccessStatus, setShowSuccessStatus] = useState(false);
  const [showErrorStatus, setShowErrorStatus] = useState(false);

  const [activePaymentType, setActivePaymentType] = useState(
    totalPrice === 0 ? "free" : "card"
  );
  const paymentData = useRef({
    expiry: new Date().toISOString().slice(0, 7),
  });
  const [formErrors, setFormErrors] = useState([]);
  const payment = new PaymentJs();

  useEffect(() => {
    if (activePaymentType === "card") {
      payment.init(
        "M4FdU31h65jw72oH6Xz6",
        "card-number",
        "cvv",
        function (payment) {
          payment.setNumberStyle({
            ...paymentFormInputStyle,
            ...(formErrors.some((error) => error.attribute === "number") &&
              errorPaymentFormInputStyle),
          });
          payment.setCvvStyle({
            ...paymentFormInputStyle,
            ...(formErrors.some((error) => error.attribute === "number") &&
              errorPaymentFormInputStyle),
          });
          payment.numberOn("input", function () {});
        }
      );
    }
  }, [activePaymentType, totalPrice, showErrorStatus]);

  const cardInputsChangeHandler = (event) => {
    const { name, value } = event.target;
    paymentData.current = {
      ...paymentData.current,
      [name]: value,
    };
  };

  const handleRecaptchaChange = (value) => {
    console.log("reCAPTCHA value:", value);
    // Handle reCAPTCHA validation logic
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();

    const [year, month] = paymentData.current.expiry.split("-");
    console.log(paymentData.current);
    try {
      if (activePaymentType === "card") {
        payment.tokenize(
          {
            email: paymentData.current.email.toLowerCase(),
            card_holder: paymentData.current.name.toUpperCase(),
            year,
            month,
          },
          function (token, cardData) {
            e.target.reset();
            paymentData.current = {
              expiry: new Date().toISOString().slice(0, 7),
            };
            setFormErrors([]);
            setShowSuccessStatus(true);
            console.log("card_token", token);
          },
          function (errors) {
            console.log("card_errors", errors);
            e.target.reset();
            paymentData.current = {
              expiry: new Date().toISOString().slice(0, 7),
            };
            setFormErrors(errors);
            setShowErrorStatus(true);
          }
        );
      } else if (activePaymentType === "bank") {
        console.log("Bank Payment Done");
        setShowSuccessStatus(true);
      }
    } catch (error) {
      console.log(error);
      setShowErrorStatus(true);
      navigate(-1);
    }
  };

  return (
    <div className="checkout-component">
      <h2 className="checkout-title">
        {activePaymentType === "free" ? "Free" : "Payment"} Checkout
      </h2>
      <div className="top-payment-buttons">
        <PrimaryButton
          onClick={() => setActivePaymentType("card")}
          className={`top-payment-button ${
            activePaymentType !== "card" && "in-active-button"
          }`}
          disabled={totalPrice === 0}
        >
          <ReactSVG src="/icons/tools/card-payment.svg" />
          Credit Card
        </PrimaryButton>
        <PrimaryButton
          onClick={() => setActivePaymentType("bank")}
          className={`top-payment-button ${
            activePaymentType !== "bank" && "in-active-button"
          }`}
          disabled={totalPrice === 0}
        >
          <ReactSVG src="/icons/tools/bank-payment.svg" />
          Bank Transfer
        </PrimaryButton>
      </div>
      <form className="payment-form-container" onSubmit={submitFormHandler}>
        <div className="form-item">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            className="email"
            placeholder="Email address"
            required
            onChange={cardInputsChangeHandler}
          />
        </div>
        {activePaymentType === "card" && (
          <>
            <div
              className={`form-item ${
                formErrors.some((error) => error.attribute === "number")
                  ? "error"
                  : ""
              }`}
            >
              <label htmlFor="card-number">Card Number</label>
              <div id="card-number"></div>
              {formErrors.some((error) => error.attribute === "number") && (
                <p className="error-message">Something wrong!</p>
              )}
            </div>
            <div className="side-by-side-inputs">
              <div className="form-item">
                <label htmlFor="expiry">Expiry*</label>
                <input
                  type="month"
                  min={new Date().toISOString().slice(0, 7)}
                  defaultValue={new Date().toISOString().slice(0, 7)}
                  id="expiry"
                  name="expiry"
                  required
                  onChange={cardInputsChangeHandler}
                />
              </div>
              <div
                className={`form-item ${
                  formErrors.some((error) => error.attribute === "cvv")
                    ? "error"
                    : ""
                }`}
              >
                <label htmlFor="cvv">CVV*</label>
                <div id="cvv"></div>
                {formErrors.some((error) => error.attribute === "cvv") && (
                  <p className="error-message">Something wrong!</p>
                )}
              </div>
            </div>{" "}
          </>
        )}
        {activePaymentType === "bank" && (
          <>
            <div className={`form-item `}>
              <label htmlFor="address">Address*</label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Address"
                required
                minLength={6}
                onChange={cardInputsChangeHandler}
              />
            </div>
            <div className="side-by-side-inputs">
              <div className={`form-item `}>
                <label htmlFor="city">City/State*</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="City"
                  required
                  minLength={2}
                  onChange={cardInputsChangeHandler}
                />
              </div>
              <div className={`form-item postal-code`}>
                <label htmlFor="postalCode">Postal Code*</label>
                <input
                  type="number"
                  name="postalCode"
                  id="postalCode"
                  placeholder="Postal code"
                  required
                  minLength={0}
                  maxLength={9}
                  onChange={cardInputsChangeHandler}
                />
              </div>
              <div className={`form-item `}>
                <label htmlFor="country">Country*</label>
                <select
                  name="country"
                  required
                  onChange={cardInputsChangeHandler}
                >
                  <option value="slovakia">Slovakia</option>
                  <option value="usa">United States</option>
                </select>
              </div>
            </div>
          </>
        )}
        <div
          className={`form-item ${
            formErrors.some((error) => error.attribute === "card_holder")
              ? "error"
              : ""
          }`}
        >
          <label htmlFor="name">
            {activePaymentType === "card" ? "Account Holder Name" : "Surname"}
          </label>
          <input
            type="name"
            name="name"
            id="name"
            className="name-input"
            placeholder={
              activePaymentType === "card" ? "Account Holder Name" : "Surname"
            }
            required
            minLength={6}
            onChange={cardInputsChangeHandler}
          />
          {formErrors.some((error) => error.attribute === "card_holder") && (
            <p className="error-message">Something wrong!</p>
          )}
        </div>

        {activePaymentType === "free" && (
          <ReCAPTCHA
            sitekey="6LeuCyonAAAAAB7ZwNOWN1BMtrCfGfBcLGgU8C0z"
            onChange={handleRecaptchaChange}
          />
        )}

        <div className="checkboxes-container">
          <div className="form-item-checkbox">
            <input
              type="checkbox"
              id="termsAndConditions"
              name="termsAndConditions"
              required
              onChange={cardInputsChangeHandler}
            />
            <label htmlFor="termsAndConditions">
              I agree to the <span> Terms and conditions </span> and
              <span> Privacy Policy </span>
            </label>
          </div>
          <div className="form-item-checkbox">
            <input
              type="checkbox"
              id="recommendations"
              name="recommendations"
              onChange={cardInputsChangeHandler}
            />
            <label htmlFor="recommendations">
              I want to receive event recommendations via
              <span> email </span>
            </label>
          </div>
        </div>
        <PrimaryButton type="submit" className="submit-payment-form">
          Pay ${`140.00`}
        </PrimaryButton>
      </form>
      {activePaymentType === "card" && (
        <>
          <div className="other-payment-options-divider">
            <hr />
            <p>Other payment options</p>
            <hr />
          </div>
          <div className="other-payment-options-container">
            <button className="apple-pay-button">
              Pay with <ReactSVG src="/icons/tools/apple-pay.svg" />
            </button>
            <button className="google-pay-button">
              <p>Pay with</p>
              <ReactSVG src="/icons/tools/google-pay.svg" />
            </button>
            <button className="valu-pay-button">
              <p>Pay with</p> <ReactSVG src="/icons/tools/valu-pay.svg" />
            </button>
          </div>
        </>
      )}

      {/* SUCCESS MODAL */}
      <StatusModal
        open={showSuccessStatus}
        onCancel={setShowSuccessStatus}
        headline="Congratulations!"
        description="You have successfully buy the tickets. Please enjoy your event."
        button={{ text: "Continue Shopping", link: "/all-events" }}
        link={{ text: "Back to Home", url: "/" }}
        icon="/icons/tools/claps-success-status.svg"
      />

      {/* FAILURE MODAL */}
      <StatusModal
        open={showErrorStatus}
        onCancel={setShowErrorStatus}
        headline="Oops!"
        description="You have an issue with the payment process which may cause because of payment method."
        button={{ text: "Try again", link: "./" }}
        link={{ text: "Contact Support", url: "/" }}
        icon="/icons/tools/warning-error-status.svg"
      />
    </div>
  );
};

export default Checkout;
