import React from "react";
import { useNavigate } from "react-router-dom";
import { usePostApi } from "../../hooks/api-hooks/usePostApi";
import { message } from "antd";
import PrimaryButton from "../UI/PrimaryButton";
import "./StripeOnboardingBanner.scss";

const StripeOnboardingBanner = ({ isConnected }) => {
  const navigate = useNavigate();
  const { handleMutation, isLoading } = usePostApi();

  const goToFinance = () => {
    navigate("/business/settings/finance");
  };

  const startOnboarding = () => {
    handleMutation(
      {
        path: "stripe/connect/account-link",
        data: {},
      },
      (res) => {
        const url = res?.data?.url;
        if (url) {
          window.location.href = url;
        } else {
          message.error("Could not start Stripe onboarding");
          goToFinance();
        }
      },
      () => {
        message.error("Could not start Stripe onboarding");
        goToFinance();
      }
    );
  };

  return (
    <div className="stripe-onboarding-banner" role="alert">
      <div className="stripe-onboarding-banner__text">
        <strong>Connect your Stripe account</strong>
        <p>
          Please onboard your Stripe account to receive payouts. You cannot
          manage events, tickets, or other organization tasks until Stripe is
          connected and charges are enabled.
        </p>
      </div>
      <div className="stripe-onboarding-banner__actions">
        <PrimaryButton
          type="button"
          disabled={isLoading}
          onClick={startOnboarding}
        >
          {isConnected ? "Continue Stripe onboarding" : "Connect Stripe"}
        </PrimaryButton>
        <button
          type="button"
          className="stripe-onboarding-banner__link"
          onClick={goToFinance}
        >
          Go to Finance settings
        </button>
      </div>
    </div>
  );
};

export default StripeOnboardingBanner;
