import React, { useState } from "react";
import "./SettingsForm.scss";
import PrimaryButton from "../UI/PrimaryButton";
import validateFinanceInformation from "../../validation/FinanceInformation";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";

const initialState = {
  iban: "",
  accountName: "",
  invoiceEmail: "",
};

const FinanceInformation = () => {
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});

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

    const formData = new FormData();
    formData.append("iban", formValues.iban);
  };

  return (
    <form className="business-settings-form" onSubmit={handleSubmit}>
      <h3>Finance Information</h3>
      <div className="side-by-side-settings-input">
        <div className={`single-form-item ${formErrors.iban ? "error" : ""}`}>
          <label htmlFor="iban">IBAN</label>
          <input
            name="iban"
            type="text"
            id="iban"
            placeholder="IBAN"
            onChange={handleInputChange}
            value={formValues.iban}
            onBlur={handleOnBlur}
          />
          {formErrors.iban && (
            <p className="error-message">{formErrors.iban}</p>
          )}
        </div>
        <div
          className={`single-form-item ${
            formErrors.accountName ? "error" : ""
          }`}
        >
          <label htmlFor="accountName">Account name</label>
          <input
            name="accountName"
            type="number"
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
        <label htmlFor="invoiceEmail">Send Invoice to Email</label>
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

      <PrimaryButton className={"settings-form-submit-button"}>
        Save changes
      </PrimaryButton>
    </form>
  );
};

export default FinanceInformation;
