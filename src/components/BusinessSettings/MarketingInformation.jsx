import React, { useState } from "react";
import "./SettingsForm.scss";
import PrimaryButton from "../UI/PrimaryButton";
import TertiaryButton from "../UI/TertiaryButton";
import validateMarketingInformation from "../../validation/MarketingInformation";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";

const initialState = {
  metaPixel: "",
  googleAnalytics: "",
  apiAccessKey: "",
};

const MarketingInformation = () => {
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateMarketingInformation, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateMarketingInformation(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("metaPixel", formValues.metaPixel);
  };

  return (
    <form className="business-settings-form" onSubmit={handleSubmit}>
      <h3>Marketing Information</h3>

      <div
        className={`single-form-item ${formErrors.metaPixel ? "error" : ""}`}
      >
        <label htmlFor="metaPixel">Meta Pixel ID</label>
        <input
          name="metaPixel"
          type="text"
          id="metaPixel"
          placeholder="Meta Pixel ID"
          onChange={handleInputChange}
          value={formValues.metaPixel}
          onBlur={handleOnBlur}
        />
        {formErrors.metaPixel && (
          <p className="error-message">{formErrors.metaPixel}</p>
        )}
      </div>

      <div
        className={`single-form-item ${
          formErrors.googleAnalytics ? "error" : ""
        }`}
      >
        <label htmlFor="googleAnalytics">Google Analytics ID</label>
        <input
          name="googleAnalytics"
          type="text"
          id="googleAnalytics"
          placeholder="Google Analytics ID"
          onChange={handleInputChange}
          value={formValues.googleAnalytics}
          onBlur={handleOnBlur}
        />
        {formErrors.googleAnalytics && (
          <p className="error-message">{formErrors.googleAnalytics}</p>
        )}
      </div>

      <div className="side-by-side-settings-input">
        <div
          className={`single-form-item ${
            formErrors.apiAccessKey ? "error" : ""
          }`}
        >
          <label htmlFor="apiAccessKey">API Access Key</label>
          <input
            name="apiAccessKey"
            type="text"
            id="apiAccessKey"
            placeholder="API Access Key"
            onChange={handleInputChange}
            value={formValues.apiAccessKey}
            onBlur={handleOnBlur}
          />
          {formErrors.apiAccessKey && (
            <p className="error-message">{formErrors.apiAccessKey}</p>
          )}
        </div>
        <TertiaryButton type="button" className={"generate-new-api-key-button"}>
          Generate new API Key
        </TertiaryButton>
      </div>

      <PrimaryButton className={"settings-form-submit-button"}>
        Save changes
      </PrimaryButton>
    </form>
  );
};

export default MarketingInformation;
