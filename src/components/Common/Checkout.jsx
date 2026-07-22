import React, { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import validateCheckoutForm from "../../validation/Checkout";
import { ReactSVG } from "react-svg";
import "./Checkout.scss";

import PrimaryButton from "../UI/PrimaryButton";
import { useNavigate } from "react-router-dom";
import StatusModal from "../UI/StatusModal";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";
import { useCountriesList } from "../../api/services";
import { useBookingContext } from "../../context/booking-context";
import { usePostApi } from "../../hooks/api-hooks/usePostApi";
import SecondaryButton from "../UI/SecondaryButton";
import currencySymbolGenerator from "../../utilities/currencySymbolGenerator";

const initialState = {
  termsAndConditions: false,
  recommendations: false,
};

const Checkout = ({ setCoupon, eventData }) => {
  const { state, dispatch } = useBookingContext();
  const navigate = useNavigate();
  const [showSuccessStatus, setShowSuccessStatus] = useState(false);
  const [showErrorStatus, setShowErrorStatus] = useState(false);

  const [activePaymentType, setActivePaymentType] = useState(
    state.orderAmount === 0 ? "free" : "card"
  );
  const [paymentData, setPaymentData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [showCouponApplied, setShowCouponApplied] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const { isLoading: countriesLoading } = useCountriesList(
    (res) => {
      setCountries(Array.isArray(res) ? res : []);
    },
    () => {}
  );

  const { handleMutation, isLoading: isPaymentLoading } = usePostApi();

  useEffect(() => {
    setActivePaymentType(state.orderAmount === 0 ? "free" : "card");
  }, [state.orderAmount]);

  const cardInputsChangeHandler = async (event) => {
    const { name, value } = event.target;
    setPaymentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateCheckoutForm, setFormErrors);
  };

  const handleRecaptchaChange = (value) => {
    setPaymentData({ ...paymentData, recaptcha: value });
  };

  const discountCodeChangeHandler = (event) => {
    const { value } = event.target;
    dispatch({
      type: "UPDATE_FIELD",
      field: "discountCode",
      value,
    });
  };

  // Gross = (ticket subtotal after % coupon) + VAT. Do not double-count VAT.
  const calculateTotal = () => {
    let subtotal = state.orderAmount;
    if (appliedCoupon?.discount) {
      const discountAmount = subtotal * (appliedCoupon.discount / 100);
      subtotal = subtotal - discountAmount;
    }
    const vatRatio =
      state.orderAmount > 0 ? subtotal / state.orderAmount : 1;
    const adjustedVat = (state.orderAmountWithVat || 0) * vatRatio;
    return (subtotal + adjustedVat).toFixed(2);
  };

  const buttonText = () => {
    const total = calculateTotal();
    const discountText = appliedCoupon?.discount
      ? `(${appliedCoupon?.discount}% Discount)`
      : "";
    return `${total} ${discountText}`;
  };

  const applyDiscountCodeHandler = async () => {
    handleMutation(
      {
        path: "coupon/validate",
        data: { eventId: state?.eventId, couponCode: state?.discountCode },
      },
      (res) => {
        setShowCouponApplied(true);
        setAppliedCoupon(res?.coupon);
        setCoupon(res?.coupon);
      },
      () => {
        setAppliedCoupon(null);
        setShowCouponApplied(false);
      }
    );
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("eventId", state?.eventId);
    formData.append("recommendations", paymentData?.recommendations);
    formData.append("tickets", JSON.stringify(state?.tickets));
    formData.append("noOfTickets", state?.totalTickets);
    formData.append("orderAmount", calculateTotal() || 0);
    formData.append("customerEmail", paymentData?.email);
    formData.append("customerName", paymentData?.name);
    formData.append("discountCode", state?.discountCode || "");
    formData.append("country", paymentData?.country || "");
    formData.append("city", paymentData?.city || "");
    formData.append("postalCode", paymentData?.postalCode || "");
    formData.append("addressDescription", paymentData?.address || "");
    return formData;
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();
    const errors = await validateCheckoutForm(paymentData, activePaymentType);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const formData = buildFormData();

    try {
      if (activePaymentType === "card") {
        handleMutation(
          {
            path: "stripe/create-checkout-session",
            data: formData,
          },
          (res) => {
            const checkoutUrl = res?.data?.url;
            if (checkoutUrl) {
              window.location.href = checkoutUrl;
              return;
            }
            setShowErrorStatus(true);
          },
          () => {
            setShowErrorStatus(true);
          }
        );
      } else if (activePaymentType === "free") {
        handleMutation(
          {
            path: "create-free-order",
            data: formData,
          },
          () => {
            setShowSuccessStatus(true);
          },
          () => {
            setShowErrorStatus(true);
          }
        );
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
      {state.orderAmount > 0 && (
        <div className="top-payment-buttons">
          <PrimaryButton
            className="top-payment-button"
            disabled={false}
            type="button"
          >
            <ReactSVG src="/icons/tools/card-payment.svg" />
            Credit Card
          </PrimaryButton>
        </div>
      )}
      <form className="payment-form-container" onSubmit={submitFormHandler}>
        <div className={`form-item ${formErrors?.email ? "error" : ""}`}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            className="email"
            placeholder="Email address"
            onChange={cardInputsChangeHandler}
            onBlur={handleOnBlur}
          />
          {formErrors.email && (
            <p className="error-message">{formErrors.email}</p>
          )}
        </div>
        {activePaymentType === "card" && (
          <p className="stripe-redirect-note">
            You will be redirected to Stripe’s secure checkout to complete your
            card payment.
          </p>
        )}
        {activePaymentType !== "free" && (
          <>
            <div className={`form-item ${formErrors?.address ? "error" : ""}`}>
              <label htmlFor="address">Address*</label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Address"
                minLength={6}
                onChange={cardInputsChangeHandler}
                onBlur={handleOnBlur}
              />
              {formErrors.address && (
                <p className="error-message">{formErrors.address}</p>
              )}
            </div>
            <div className="side-by-side-inputs">
              <div className={`form-item ${formErrors?.city ? "error" : ""}`}>
                <label htmlFor="city">City/State*</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="City"
                  minLength={2}
                  onChange={cardInputsChangeHandler}
                  onBlur={handleOnBlur}
                />
                {formErrors.city && (
                  <p className="error-message">{formErrors.city}</p>
                )}
              </div>
              <div
                className={`form-item postal-code ${
                  formErrors?.postalCode ? "error" : ""
                }`}
              >
                <label htmlFor="postalCode">Postal Code*</label>
                <input
                  type="number"
                  name="postalCode"
                  id="postalCode"
                  placeholder="Postal code"
                  minLength={0}
                  maxLength={9}
                  onChange={cardInputsChangeHandler}
                  onBlur={handleOnBlur}
                />
                {formErrors.postalCode && (
                  <p className="error-message">{formErrors.postalCode}</p>
                )}
              </div>
              <div
                className={`form-item ${formErrors?.country ? "error" : ""}`}
              >
                <label htmlFor="country">Country*</label>
                <select
                  name="country"
                  onChange={cardInputsChangeHandler}
                  onBlur={handleOnBlur}
                >
                  <option>Chose one</option>
                  {!countriesLoading &&
                    countries?.length > 0 &&
                    countries?.map((el) => (
                      <option key={el?.countryName} value={el?.countryName}>
                        {el?.countryName}
                      </option>
                    ))}
                </select>
                {formErrors.country && (
                  <p className="error-message">{formErrors.country}</p>
                )}
              </div>
            </div>
          </>
        )}
        <div className={`form-item ${formErrors.name ? "error" : ""}`}>
          <label htmlFor="name">Full Name</label>
          <input
            type="name"
            name="name"
            id="name"
            className="name-input"
            placeholder="Your full name"
            minLength={6}
            onChange={cardInputsChangeHandler}
            onBlur={handleOnBlur}
          />
          {formErrors.name && <p className="error-message">Something wrong!</p>}
        </div>

        {activePaymentType === "free" && (
          <ReCAPTCHA
            sitekey="6LeuCyonAAAAAB7ZwNOWN1BMtrCfGfBcLGgU8C0z"
            onChange={handleRecaptchaChange}
          />
        )}

        {activePaymentType === "card" && (
          <>
            {!showDiscountInput && state?.discountCode?.trim() === "" && (
              <h4
                className="discount-code-button"
                onClick={() => setShowDiscountInput(true)}
              >
                Add Discount Coupon Code
              </h4>
            )}

            {!showCouponApplied ? (
              (showDiscountInput || state?.discountCode?.trim() !== "") && (
                <>
                  <div className={`form-item `}>
                    <label>Discount Code</label>
                    <input
                      type="text"
                      name="discountCode"
                      id="discountCode"
                      placeholder="Discount Code"
                      minLength={8}
                      maxLength={12}
                      value={state.discountCode}
                      onChange={discountCodeChangeHandler}
                    />
                  </div>
                  <SecondaryButton
                    type={"button"}
                    disabled={
                      state?.discountCode?.trim() === "" ||
                      state?.discountCode?.length !== 8
                    }
                    onClick={applyDiscountCodeHandler}
                  >
                    Apply Code
                  </SecondaryButton>
                </>
              )
            ) : (
              <p className="black">
                Coupon has been applied and you got{" "}
                {appliedCoupon?.discount || 0}% discount
              </p>
            )}
          </>
        )}

        <div className="checkboxes-container">
          <div className={`form-item-checkbox`}>
            <input
              type="checkbox"
              id="termsAndConditions"
              name="termsAndConditions"
              onChange={() => {
                const e = {
                  target: {
                    value: !paymentData.termsAndConditions,
                    name: "termsAndConditions",
                  },
                };
                useHandleOnBlur(e, validateCheckoutForm, setFormErrors);
                cardInputsChangeHandler(e);
              }}
              onBlur={() =>
                handleOnBlur({
                  target: {
                    value: paymentData.termsAndConditions,
                    name: "termsAndConditions",
                  },
                })
              }
              checked={paymentData.termsAndConditions}
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
              onChange={() =>
                cardInputsChangeHandler({
                  target: {
                    value: !paymentData.recommendations,
                    name: "recommendations",
                  },
                })
              }
              checked={paymentData.recommendations}
            />
            <label htmlFor="recommendations">
              I want to receive event recommendations via
              <span> email </span>
            </label>
          </div>
        </div>
        {formErrors.termsAndConditions && (
          <p className="error-message-form">{formErrors.termsAndConditions}</p>
        )}
        {formErrors.recaptcha && (
          <p className="error-message-form">{formErrors.recaptcha}</p>
        )}
        <PrimaryButton
          disabled={state.totalTickets === 0 || isPaymentLoading}
          type={state.totalTickets === 0 ? "button" : "submit"}
          className="submit-payment-form"
        >
          {activePaymentType === "card" ? "Pay with Stripe" : "Pay"}{" "}
          {currencySymbolGenerator(eventData?.eventCurrency)} {buttonText()}
        </PrimaryButton>
      </form>

      <StatusModal
        open={showSuccessStatus}
        onCancel={(status) => {
          setShowSuccessStatus(status);
          dispatch({ type: "RESET_STATE" });
        }}
        headline="Congratulations!"
        description="You successfully have bought the ticket(s). Please enjoy your event."
        button={{ text: "Continue Shopping", link: "/all-events" }}
        link={{ text: "Back to Home", url: "/" }}
        icon="/icons/tools/claps-success-status.svg"
      />

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
