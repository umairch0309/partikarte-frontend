import React, { useState } from "react";
import "./SettingsForm.scss";
import PrimaryButton from "../UI/PrimaryButton";
import validateCompanyInformation from "../../validation/CompanyInformation";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";

const initialState = {
  companyName: "",
  vatNumber: "",
  businessRegistryNumber: "",
  address: "",
  country: "",
  city: "",
  postalCode: "",
};

const CompanyInformation = () => {
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateCompanyInformation, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateCompanyInformation(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("companyName", formValues.companyName);
  };

  return (
    <form className="business-settings-form" onSubmit={handleSubmit}>
      <h3>Company Information</h3>
      <div
        className={`single-form-item ${formErrors.companyName ? "error" : ""}`}
      >
        <label htmlFor="companyName">Company name</label>
        <input
          name="companyName"
          type="text"
          id="companyName"
          placeholder="Company name"
          onChange={handleInputChange}
          value={formValues.companyName}
          onBlur={handleOnBlur}
        />
        {formErrors.companyName && (
          <p className="error-message">{formErrors.companyName}</p>
        )}
      </div>
      <div className="side-by-side-settings-input">
        <div
          className={`single-form-item ${formErrors.vatNumber ? "error" : ""}`}
        >
          <label htmlFor="vatNumber">VAT number</label>
          <input
            name="vatNumber"
            type="number"
            id="vatNumber"
            placeholder="VAT number"
            onChange={handleInputChange}
            value={formValues.vatNumber}
            onBlur={handleOnBlur}
          />
          {formErrors.vatNumber && (
            <p className="error-message">{formErrors.vatNumber}</p>
          )}
        </div>
        <div
          className={`single-form-item ${
            formErrors.businessRegistryNumber ? "error" : ""
          }`}
        >
          <label htmlFor="businessRegistryNumber">Registry number</label>
          <input
            name="businessRegistryNumber"
            type="number"
            id="businessRegistryNumber"
            placeholder="Registry number"
            onChange={handleInputChange}
            value={formValues.businessRegistryNumber}
            onBlur={handleOnBlur}
          />
          {formErrors.businessRegistryNumber && (
            <p className="error-message">{formErrors.businessRegistryNumber}</p>
          )}
        </div>
      </div>
      <div className={`single-form-item ${formErrors.address ? "error" : ""}`}>
        <label htmlFor="address">Address</label>
        <input
          name="address"
          type="text"
          id="address"
          placeholder="Address"
          onChange={handleInputChange}
          value={formValues.address}
          onBlur={handleOnBlur}
        />
        {formErrors.address && (
          <p className="error-message">{formErrors.address}</p>
        )}
      </div>
      <div className="side-by-side-settings-input">
        <div
          className={`single-form-item ${formErrors.country ? "error" : ""}`}
        >
          <label htmlFor="guestType">Country</label>
          <select
            onChange={handleInputChange}
            name="country"
            id="country"
            value={formValues.country}
            onBlur={handleOnBlur}
          >
            <option value="">Choose country</option>
            <option value="usa">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="slovakia">Slovakia</option>
          </select>
          {formErrors.country && (
            <p className="select-error-message">{formErrors.country}</p>
          )}
        </div>
        <div className={`single-form-item ${formErrors.city ? "error" : ""}`}>
          <label htmlFor="city">City/State</label>
          <select
            onChange={handleInputChange}
            name="city"
            id="city"
            value={formValues.city}
            onBlur={handleOnBlur}
          >
            <option value="">Choose city/state</option>
            <option value="new-york">New York</option>
            <option value="london">London</option>
            <option value="moscow">Moscow</option>
          </select>
          {formErrors.city && (
            <p className="select-error-message">{formErrors.city}</p>
          )}
        </div>
        <div
          className={`single-form-item ${formErrors.postalCode ? "error" : ""}`}
        >
          <label htmlFor="postalCode">Postal code</label>
          <input
            name="postalCode"
            type="number"
            id="postalCode"
            placeholder="Postal code"
            onChange={handleInputChange}
            value={formValues.postalCode}
            onBlur={handleOnBlur}
          />
          {formErrors.postalCode && (
            <p className="error-message">{formErrors.postalCode}</p>
          )}
        </div>
      </div>
      <PrimaryButton className={"settings-form-submit-button"}>
        Save changes
      </PrimaryButton>
    </form>
  );
};

export default CompanyInformation;
