import React, { useRef, useState, useEffect } from "react";
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
import { message } from "antd";
import currencySymbolGenerator from "../../utilities/currencySymbolGenerator";

const initialState = {
  termsAndConditions: false,
  recommendations: false,
  expiry: new Date().toISOString().slice(0, 7),
};
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
const payment = new PaymentJs();

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
      setCountries(res);
      console.log(res, " countries list");
    },
    (res) => {
      console.log(res, "countries list error");
    }
  );

  const { handleMutation, isLoading: isEventCreating } = usePostApi();

  // console.log(paymentData);

  useEffect(() => {
    setActivePaymentType(state.orderAmount === 0 ? "free" : "card");
  }, [state.orderAmount]);

  useEffect(() => {
    if (activePaymentType === "card") {
      payment.init(
        "f8MjXVeBVjTx8ANPMzUu",
        "card-number",
        "cvv",
        function (payment) {
          console.log("init card");
          payment.setNumberStyle({
            ...paymentFormInputStyle,
            ...(formErrors.number && errorPaymentFormInputStyle),
          });
          payment.setCvvStyle({
            ...paymentFormInputStyle,
            ...(formErrors.number && errorPaymentFormInputStyle),
          });
          payment.numberOn("input", function () {});
        }
      );
    }
  }, [activePaymentType, state.orderAmount, showErrorStatus]);

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
    console.log("reCAPTCHA value:", value);
    setPaymentData({ ...paymentData, recaptcha: value });
  };

  const discountCodeChangeHandler = (event) => {
    const { name, value } = event.target;
    dispatch({
      type: "UPDATE_FIELD",
      field: "discountCode",
      value,
    });
  };

  const calculateTotal = () => {
    let total = state.orderAmount;
    const couponDiscount = state.orderAmount / appliedCoupon?.discount;
    if (appliedCoupon?.discount && couponDiscount) {
      total = total - couponDiscount;
    }
    return (total + state.orderAmountWithVat).toFixed(2);
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
        console.log("applied discountCode", res);
        setShowCouponApplied(true);
        setAppliedCoupon(res?.coupon);
        setCoupon(res?.coupon);
      },
      (res) => {
        console.log(res, " couldnt do discount code");
        setAppliedCoupon(null);
        setShowCouponApplied(false);
      }
    );
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();
    const errors = await validateCheckoutForm(paymentData, activePaymentType);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      console.log("error existed", errors);
      return;
    }
    setFormErrors({});
    const [year, month] = paymentData.expiry.split("-");
    console.log(paymentData);

    const formData = new FormData();
    formData.append("eventId", state?.eventId);
    formData.append("recommendations", paymentData?.recommendations);
    formData.append("tickets", JSON.stringify(state?.tickets));
    formData.append("noOfTickets", state?.totalTickets);
    formData.append("orderAmount", calculateTotal() || 0);
    formData.append("orderVatAmount", state?.orderAmountWithVat || 0);
    formData.append("customerEmail", paymentData?.email);
    formData.append("customerName", paymentData?.name);

    try {
      if (activePaymentType === "card") {
        payment.tokenize(
          {
            email: paymentData.email?.toLowerCase(),
            card_holder: paymentData.name?.toUpperCase(),
            year,
            month,
          },
          function (token, cardData) {
            console.log(cardData, " card data");
            formData.append("paymentRequestToken", token);
            formData.append("discountCode", state?.discountCode);
            formData.append("country", paymentData?.country);
            formData.append("city", paymentData?.city);
            formData.append("postalCode", paymentData?.postalCode);
            formData.append("addressDescription", paymentData?.address);
            formData.append(
              "countryCode",
              countries.find(
                (country) => country.countryName === paymentData?.country
              )?.countryCode
            );

            handleMutation(
              {
                path: "create-card-payment-order",
                data: formData,
              },
              (res) => {
                console.log("card payment done", res);
                if (
                  res?.data?.redirectType === "iframe" &&
                  res?.data?.returnType === "REDIRECT" &&
                  res?.data?.redirectUrl
                ) {
                  window.open(res?.data?.redirectUrl, "_blank");
                  navigate("/");
                } else {
                  setShowSuccessStatus(true);
                }
                e.target.reset();
                setPaymentData(initialState);
                setFormErrors({});
                dispatch({ type: "RESET_STATE" });
              },
              (res) => {
                console.log(res, " couldnt do card payment");
                setShowErrorStatus(true);
              }
            );

            console.log("card_token", token);
          },
          function (errors) {
            console.log("card_errors", errors);
            e.target.reset();
            setPaymentData(initialState);
            const newErrors = {};
            errors.forEach((e) => {
              newErrors[e.attribute] = e.message;
            });
            setFormErrors((prevState) => ({ ...prevState, ...newErrors }));
            setShowErrorStatus(true);
          }
        );
      } else if (activePaymentType === "bank") {
        console.log("bank");
        formData.append("country", paymentData?.country);
        formData.append("city", paymentData?.city);
        formData.append("postalCode", paymentData?.postalCode);
        formData.append("addressDescription", paymentData?.address);
        formData.append("discountCode", state?.discountCode);

        handleMutation(
          {
            path: "create-bank-payment-order",
            data: formData,
          },
          (res) => {
            console.log("Bank Payment Done");
            setShowSuccessStatus(true);
          },
          (res) => {
            console.log(res, " couldnt do bank payment");
            setShowErrorStatus(true);
          }
        );
      } else if (activePaymentType === "free") {
        handleMutation(
          {
            path: "create-free-order",
            data: formData,
          },
          (res) => {
            console.log("Free payment done");
            setShowSuccessStatus(true);
          },
          (res) => {
            console.log(res, " couldnt do free payment");
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
      <div className="top-payment-buttons">
        <PrimaryButton
          onClick={() => {
            setActivePaymentType("card");
            setFormErrors({});
          }}
          className={`top-payment-button ${
            activePaymentType !== "card" && "in-active-button"
          }`}
          disabled={state.orderAmount === 0}
        >
          <ReactSVG src="/icons/tools/card-payment.svg" />
          Credit Card
        </PrimaryButton>
        <PrimaryButton
          // onClick={() => {
          //   setActivePaymentType("bank");
          //   setFormErrors({});
          // }}
          className={`top-payment-button ${
            activePaymentType !== "bank" && "in-active-button"
          }`}
          onClick={() => {
            message.error("Bank Transfer will be available soon.");
          }}
          title="Bank Transfer will be available soon."
          // disabled={state.orderAmount === 0}
          disabled={true}
        >
          <ReactSVG src="/icons/tools/bank-payment.svg" />
          Bank Transfer
        </PrimaryButton>
      </div>
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
          <>
            <div className={`form-item ${formErrors?.number ? "error" : ""}`}>
              <label htmlFor="card-number">Card Number</label>
              <div id="card-number"></div>
              {formErrors?.number && (
                <p className="error-message">Something wrong!</p>
              )}
            </div>
            <div className="side-by-side-inputs">
              <div className={`form-item ${formErrors?.expiry ? "error" : ""}`}>
                <label htmlFor="expiry">Expiry*</label>
                <input
                  type="month"
                  min={new Date().toISOString().slice(0, 7)}
                  defaultValue={new Date().toISOString().slice(0, 7)}
                  id="expiry"
                  name="expiry"
                  onChange={cardInputsChangeHandler}
                  onBlur={handleOnBlur}
                />
                {formErrors.expiry && (
                  <p className="error-message">{formErrors.expiry}</p>
                )}
              </div>
              <div className={`form-item ${formErrors.cvv ? "error" : ""}`}>
                <label htmlFor="cvv">CVV*</label>
                <div id="cvv"></div>
                {formErrors.number && <p className="error-message">Error!</p>}
              </div>
            </div>{" "}
          </>
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
                      <option value={el?.countryName}>{el?.countryName}</option>
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
          <label htmlFor="name">
            {activePaymentType === "card" ? "Account Holder Name" : "Full Name"}
          </label>
          <input
            type="name"
            name="name"
            id="name"
            className="name-input"
            placeholder={
              activePaymentType === "card"
                ? "Name on Credit Card"
                : "Your full name"
            }
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

        {(activePaymentType === "card" || activePaymentType === "bank") && (
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
          <div
            className={`form-item-checkbox ${
              formErrors?.number ? "error" : ""
            }`}
          >
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
              onBlur={() =>
                handleOnBlur({
                  target: {
                    value: paymentData.recommendations,
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
          disabled={state.totalTickets === 0}
          type={state.totalTickets === 0 ? "button" : "submit"}
          className="submit-payment-form"
        >
          Pay {currencySymbolGenerator(eventData?.eventCurrency)} {buttonText()}
        </PrimaryButton>
      </form>
      {/* {activePaymentType === "card" && (
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
      )} */}

      {/* SUCCESS MODAL */}
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
