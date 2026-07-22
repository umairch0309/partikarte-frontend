import React, { useEffect, useState } from "react";
import "./SettingsForm.scss";
import PrimaryButton from "../UI/PrimaryButton";
import validateFinanceInformation from "../../validation/FinanceInformation";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";
import { usePutApi } from "../../hooks/api-hooks/usePutApi";
import { usePostApi } from "../../hooks/api-hooks/usePostApi";
import { useFetch } from "../../hooks/api-hooks/useFetch";
import { useProfileDetails } from "../../api/profile";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { message } from "antd";

const initialState = {
  invoiceEmail: "",
};

const FinanceInformation = () => {
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [stripeStatus, setStripeStatus] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const { isLoading: profileLoading } = useProfileDetails((res) => {
    const profile = res?.user ? res : res?.data;
    if (!profile) return;

    setFormValues({
      invoiceEmail:
        profile?.business?.financialInformation?.invoiceEmail || "",
    });
    if (profile?.business?.stripe) {
      setStripeStatus(profile.business.stripe);
    }
  });

  const { handleMutation, isLoading: isProfileUpdating } = usePutApi();
  const { handleMutation: postMutation, isLoading: isStripeLoading } =
    usePostApi();

  const { isLoading: isStatusLoading } = useFetch(
    ["stripe-connect-status"],
    "stripe/connect/status",
    {
      onSuccess: (res) => {
        setStripeStatus(res?.stripe || null);
      },
    }
  );

  useEffect(() => {
    const stripeParam = searchParams.get("stripe");
    if (stripeParam === "return" || stripeParam === "refresh") {
      queryClient.invalidateQueries({ queryKey: ["get-profile"] });
      queryClient.invalidateQueries({ queryKey: ["stripe-connect-status"] });
      if (stripeParam === "return") {
        message.success("Stripe onboarding updated. Refreshing status…");
      }
      searchParams.delete("stripe");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, queryClient]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateFinanceInformation, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateFinanceInformation(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    handleMutation(
      {
        path: "business/financial-information",
        data: formValues,
      },
      () => {
        queryClient.invalidateQueries("get-profile");
      },
      () => {}
    );
  };

  const handleConnectStripe = () => {
    postMutation(
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
        }
      },
      () => {
        message.error("Could not start Stripe onboarding");
      }
    );
  };

  const connected = Boolean(stripeStatus?.accountId);
  const chargesEnabled = Boolean(stripeStatus?.chargesEnabled);
  const payoutsEnabled = Boolean(stripeStatus?.payoutsEnabled);

  return (
    <>
      <div className="business-settings-form stripe-connect-panel">
        <h3>Stripe Connect</h3>
        <p className="stripe-connect-help">
          Connect your Stripe account to receive ticket payouts. Partikarte
          keeps an 8% platform fee on each sale; 92% goes to your connected
          account.
        </p>
        <div className="stripe-status-row">
          <span>
            Status:{" "}
            <strong>
              {!connected
                ? "Not connected"
                : chargesEnabled
                  ? "Ready to accept payments"
                  : "Onboarding incomplete"}
            </strong>
          </span>
          {connected && (
            <span>
              Charges: {chargesEnabled ? "Enabled" : "Disabled"} · Payouts:{" "}
              {payoutsEnabled ? "Enabled" : "Disabled"}
            </span>
          )}
        </div>
        <PrimaryButton
          type="button"
          disabled={isStripeLoading || isStatusLoading || profileLoading}
          className="settings-form-submit-button"
          onClick={handleConnectStripe}
        >
          {chargesEnabled
            ? "Update Stripe account"
            : connected
              ? "Continue Stripe onboarding"
              : "Connect Stripe"}
        </PrimaryButton>
      </div>

      <form className="business-settings-form" onSubmit={handleSubmit}>
        <h3>Invoice settings</h3>
        <div
          className={`single-form-item ${formErrors.invoiceEmail ? "error" : ""}`}
        >
          <label htmlFor="invoiceEmail">Send Invoices to this E-mail</label>
          <input
            name="invoiceEmail"
            type="text"
            id="invoiceEmail"
            placeholder="Send invoice to email"
            onChange={handleInputChange}
            value={formValues.invoiceEmail}
            onBlur={handleOnBlur}
          />
          {formErrors.invoiceEmail && (
            <p className="error-message">{formErrors.invoiceEmail}</p>
          )}
        </div>

        <PrimaryButton
          disabled={profileLoading || isProfileUpdating}
          className={"settings-form-submit-button"}
        >
          Save changes
        </PrimaryButton>
      </form>
    </>
  );
};

export default FinanceInformation;
