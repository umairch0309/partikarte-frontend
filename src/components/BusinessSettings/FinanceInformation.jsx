import React, { useState } from "react";
import "./SettingsForm.scss";
import PrimaryButton from "../UI/PrimaryButton";
import validateFinanceInformation from "../../validation/FinanceInformation";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";
import { usePutApi } from "../../hooks/api-hooks/usePutApi";
import { useProfileDetails } from "../../api/profile";
import { useQueryClient } from "@tanstack/react-query";

const initialState = {
  IBAN: "",
  accountName: "",
  invoiceEmail: "",
};

const FinanceInformation = () => {
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [data, setData] = useState(null);

  const { response, isLoading: profileLoading } = useProfileDetails((res) => {
    setData(res?.data);
    setFormValues({
      IBAN: res?.data?.business?.financialInformation?.IBAN,
      accountName: res?.data?.business?.financialInformation?.accountName,
      invoiceEmail: res?.data?.business?.financialInformation?.invoiceEmail,
    });
  });

  const { handleMutation, isLoading: isProfileUpdating } = usePutApi();
  const queryClient = useQueryClient();

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
      (res) => {
        queryClient.invalidateQueries("get-profile");
      },
      (res) => {}
    );
  };

  return (
    <form className="business-settings-form" onSubmit={handleSubmit}>
      <h3>Finance Information</h3>
      <div className="side-by-side-settings-input">
        <div className={`single-form-item ${formErrors.IBAN ? "error" : ""}`}>
          <label htmlFor="IBAN">IBAN</label>
          <input
            name="IBAN"
            type="text"
            id="IBAN"
            placeholder="IBAN"
            onChange={handleInputChange}
            value={formValues.IBAN}
            onBlur={handleOnBlur}
          />
          {formErrors.IBAN && (
            <p className="error-message">{formErrors.IBAN}</p>
          )}
        </div>
        <div
          className={`single-form-item ${
            formErrors.accountName ? "error" : ""
          }`}
        >
          <label htmlFor="accountName">Account holder</label>
          <input
            name="accountName"
            type="text"
            id="accountName"
            placeholder="Account name"
            onChange={handleInputChange}
            value={formValues.accountName}
            onBlur={handleOnBlur}
          />
          {formErrors.accountName && (
            <p className="error-message">{formErrors.accountName}</p>
          )}
        </div>
      </div>
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
  );
};

export default FinanceInformation;
