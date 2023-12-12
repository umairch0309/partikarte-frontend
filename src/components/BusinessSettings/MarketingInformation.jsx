import React, { useState } from "react";
import "./SettingsForm.scss";
import PrimaryButton from "../UI/PrimaryButton";
import TertiaryButton from "../UI/TertiaryButton";
import validateMarketingInformation from "../../validation/MarketingInformation";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";
import { usePutApi } from "../../hooks/api-hooks/usePutApi";
import { useProfileDetails } from "../../api/profile";
import { useQueryClient } from "@tanstack/react-query";

const initialState = {
  metaPixelId: "",
  googleAnalyticsId: "",
  apiAccessKey: "",
};

const MarketingInformation = () => {
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [data, setData] = useState(null);

  const { response, isLoading: profileLoading } = useProfileDetails((res) => {
    setData(res?.data);
    setFormValues({
      metaPixelId: res?.data?.business?.marketingInformation?.metaPixelId,
      googleAnalyticsId:
        res?.data?.business?.marketingInformation?.googleAnalyticsId,
      apiAccessKey: res?.data?.business?.marketingInformation?.apiAccessKey,
    });
  });

  const { handleMutation, isLoading: isProfileUpdating } = usePutApi();
  const queryClient = useQueryClient();

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

    setFormErrors({});

    handleMutation(
      {
        path: "business/marketing-information",
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
      <h3>Marketing Information</h3>

      <div
        className={`single-form-item ${formErrors.metaPixelId ? "error" : ""}`}
      >
        <label htmlFor="metaPixelId">Meta Pixel ID</label>
        <input
          name="metaPixelId"
          type="text"
          id="metaPixelId"
          placeholder="Meta Pixel ID"
          onChange={handleInputChange}
          value={formValues.metaPixelId}
          onBlur={handleOnBlur}
        />
        {formErrors.metaPixelId && (
          <p className="error-message">{formErrors.metaPixelId}</p>
        )}
      </div>

      <div
        className={`single-form-item ${
          formErrors.googleAnalyticsId ? "error" : ""
        }`}
      >
        <label htmlFor="googleAnalyticsId">Google Analytics ID</label>
        <input
          name="googleAnalyticsId"
          type="text"
          id="googleAnalyticsId"
          placeholder="Google Analytics ID"
          onChange={handleInputChange}
          value={formValues.googleAnalyticsId}
          onBlur={handleOnBlur}
        />
        {formErrors.googleAnalyticsId && (
          <p className="error-message">{formErrors.googleAnalyticsId}</p>
        )}
      </div>

      <div className="side-by-side-settings-input">
        <div
          className={`single-form-item ${
            formErrors.apiAccessKey ? "error" : ""
          }`}
        >
          <label htmlFor="apiAccessKey">API Integration</label>
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

      <PrimaryButton
        disabled={profileLoading || isProfileUpdating}
        className={"settings-form-submit-button"}
      >
        Save changes
      </PrimaryButton>
    </form>
  );
};

export default MarketingInformation;
