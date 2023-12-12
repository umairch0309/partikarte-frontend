import React, { useState } from "react";
import "./SettingsForm.scss";
import PrimaryButton from "../UI/PrimaryButton";
import validateCompanyInformation from "../../validation/CompanyInformation";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";
import { usePutApi } from "../../hooks/api-hooks/usePutApi";
import { useProfileDetails } from "../../api/profile";
import { useQueryClient } from "@tanstack/react-query";
import { useCountriesList } from "../../api/services";

const initialState = {
  companyName: "",
  companyVAT: "",
  companyRegistryNumber: "",
  addressDescription: "",
  country: "",
  city: "",
  postalCode: "",
};

const CompanyInformation = () => {
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [data, setData] = useState(null);
  const [countries, setCountries] = useState([]);

  const { isLoading: countriesLoading } = useCountriesList(
    (res) => {
      setCountries(res);
    },
    (res) => {
      console.log(res, "countries list error");
    }
  );

  const { response, isLoading: profileLoading } = useProfileDetails((res) => {
    setData(res?.data);
    setFormValues({
      companyName: res?.data?.business?.company?.companyName,
      companyRegistryNumber:
        res?.data?.business?.company?.companyRegistryNumber,
      companyVAT: res?.data?.business?.company?.companyVAT,
      addressDescription:
        res?.data?.business?.company?.companyAddress?.addressDescription,
      city: res?.data?.business?.company?.companyAddress?.city,
      country: res?.data?.business?.company?.companyAddress?.country,
      postalCode: res?.data?.business?.company?.companyAddress?.postalCode,
    });
  });

  const { handleMutation, isLoading: isProfileUpdating } = usePutApi();
  const queryClient = useQueryClient();

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

    setFormErrors({});

    handleMutation(
      {
        path: "business/information",
        data: formValues,
      },
      (res) => {
        console.log(res);
        queryClient.invalidateQueries("get-profile");
      },
      (res) => {
        console.log(res);
      }
    );
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
          className={`single-form-item ${formErrors.companyVAT ? "error" : ""}`}
        >
          <label htmlFor="companyVAT">VAT number</label>
          <input
            name="companyVAT"
            type="text"
            id="companyVAT"
            placeholder="VAT number"
            onChange={handleInputChange}
            value={formValues.companyVAT}
            onBlur={handleOnBlur}
          />
          {formErrors.companyVAT && (
            <p className="error-message">{formErrors.companyVAT}</p>
          )}
        </div>
        <div
          className={`single-form-item ${
            formErrors.companyRegistryNumber ? "error" : ""
          }`}
        >
          <label htmlFor="companyRegistryNumber">Registry number</label>
          <input
            name="companyRegistryNumber"
            type="text"
            id="companyRegistryNumber"
            placeholder="Registry number"
            onChange={handleInputChange}
            value={formValues.companyRegistryNumber}
            onBlur={handleOnBlur}
          />
          {formErrors.companyRegistryNumber && (
            <p className="error-message">{formErrors.companyRegistryNumber}</p>
          )}
        </div>
      </div>
      <div
        className={`single-form-item ${
          formErrors.addressDescription ? "error" : ""
        }`}
      >
        <label htmlFor="addressDescription">Address</label>
        <input
          name="addressDescription"
          type="text"
          id="addressDescription"
          placeholder="Address"
          onChange={handleInputChange}
          value={formValues.addressDescription}
          onBlur={handleOnBlur}
        />
        {formErrors.addressDescription && (
          <p className="error-message">{formErrors.addressDescription}</p>
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
            {!countriesLoading &&
              countries?.length > 0 &&
              countries?.map((el) => (
                <option value={el?.countryName}>{el?.countryName}</option>
              ))}
          </select>
          {formErrors.country && (
            <p className="select-error-message">{formErrors.country}</p>
          )}
        </div>
        <div className={`single-form-item ${formErrors.city ? "error" : ""}`}>
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            name="city"
            value={formValues.city}
            placeholder="City"
            onChange={handleInputChange}
            onBlur={handleOnBlur}
          />
          {formErrors.city && (
            <p className="error-message">{formErrors.city}</p>
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
      <PrimaryButton
        disabled={profileLoading || isProfileUpdating}
        className={"settings-form-submit-button"}
      >
        Save changes
      </PrimaryButton>
    </form>
  );
};

export default CompanyInformation;
