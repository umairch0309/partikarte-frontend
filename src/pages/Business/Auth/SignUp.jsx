import React, { useState } from "react";
import "./SignUp.scss";
import { ReactSVG } from "react-svg";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../../../components/UI/PrimaryButton";
import validateSignUpForm from "../../../validation/SignUp";
import AuthPageLeft from "../../../components/AuthPagesComponents/AuthPageLeft";
import useHandleOnBlur from "../../../hooks/useHandleOnBlur";
import { usePostApi } from "../../../hooks/api-hooks/usePostApi";

const initalState = {
  email: "",
  password: "",
  username: "",
  companyName: "",
  companyVAT: "",
  companyRegistryNumber: "",
  addressDescription: "",
  city: "",
  postalCode: "",
  country: "",
};
const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initalState);
  const [formErrors, setFormErrors] = useState({});

  const { handleMutation, isLoading } = usePostApi();

  const handleInputChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateSignUpForm, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateSignUpForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    // use api here
    handleMutation(
      {
        path: "auth/register",
        data: formData,
      },
      (res) => {
        navigate("/business/login");
        setFormData(initalState);
      },
      (res) => {
        console.log(res);
      }
    );
    //   after submitting form
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <div className="sign-up-page">
      <AuthPageLeft />
      <div className="sign-up-page-right">
        <h1>Create Account</h1>
        <div className="top-line">
          <p>Already have an account?</p>
          <Link to={"/business/login"}>Signin now.</Link>
        </div>
        <form className="sign-up-form-container" onSubmit={handleSubmit}>
          <div className={`form-item ${formErrors.email && "error"}`}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
            />
            {formErrors.email && (
              <p className="error-message">{formErrors.email}</p>
            )}
          </div>
          <div className={`form-item ${formErrors.username && "error"}`}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              placeholder="Username"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
            />
            {formErrors.username && (
              <p className="error-message">{formErrors.username}</p>
            )}
          </div>
          <div className={`form-item ${formErrors.password && "error"}`}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
            />
            <ReactSVG
              onClick={togglePasswordVisibility}
              className="show-password"
              src="/icons/tools/eye.svg"
            />
            {formErrors.password && (
              <p className="error-message">{formErrors.password}</p>
            )}
          </div>
          <div className={`form-item ${formErrors.companyName && "error"}`}>
            <label htmlFor="companyName">Business Name</label>
            <input
              id="companyName"
              type="text"
              name="companyName"
              value={formData.companyName}
              placeholder="Business Name"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
            />
            {formErrors.companyName && (
              <p className="error-message">{formErrors.companyName}</p>
            )}
          </div>
          <div className={`form-item ${formErrors.companyVAT && "error"}`}>
            <label htmlFor="companyVAT">Business VAT Number</label>
            <input
              id="companyVAT"
              type="text"
              name="companyVAT"
              value={formData.companyVAT}
              placeholder="Business VAT Number"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
            />
            {formErrors.companyVAT && (
              <p className="error-message">{formErrors.companyVAT}</p>
            )}
          </div>
          <div
            className={`form-item ${
              formErrors.companyRegistryNumber && "error"
            }`}
          >
            <label htmlFor="companyRegistryNumber">
              Business Registry Number
            </label>
            <input
              id="companyRegistryNumber"
              type="text"
              name="companyRegistryNumber"
              value={formData.companyRegistryNumber}
              placeholder="Business Registery Number"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
            />
            {formErrors.companyRegistryNumber && (
              <p className="error-message">
                {formErrors.companyRegistryNumber}
              </p>
            )}
          </div>
          <div
            className={`form-item ${formErrors.addressDescription && "error"}`}
          >
            <label htmlFor="addressDescription">Business Address</label>
            <input
              id="addressDescription"
              type="text"
              name="addressDescription"
              value={formData.addressDescription}
              placeholder="Business Address"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
            />
            {formErrors.addressDescription && (
              <p className="error-message">{formErrors.addressDescription}</p>
            )}
          </div>
          <div className="top-line">
            <div className={`form-item ${formErrors.city && "error"}`}>
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                name="city"
                value={formData.city}
                placeholder="City"
                onChange={handleInputChange}
                onBlur={handleOnBlur}
              />
              {formErrors.city && (
                <p className="error-message">{formErrors.city}</p>
              )}
            </div>{" "}
            <div className={`form-item ${formErrors.postalCode && "error"}`}>
              <label htmlFor="postalCode">Postal/Zip Code</label>
              <input
                id="postalCode"
                type="number"
                name="postalCode"
                value={formData.postalCode}
                placeholder="Postal Code"
                onChange={handleInputChange}
                onBlur={handleOnBlur}
              />
              {formErrors.postalCode && (
                <p className="error-message">{formErrors.postalCode}</p>
              )}
            </div>
          </div>
          <div className={`form-item ${formErrors.country && "error"}`}>
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              onBlur={handleOnBlur}
            >
              <option>Choose one</option>
              <option value={"usa"}>United States</option>
              <option value={"si"}>Slovakia</option>
              <option value={"uk"}>United Kingdom</option>
              <option value={"Russia"}>Russia</option>
            </select>
            {formErrors.country && (
              <p className="error-message select-error-message">
                {formErrors.country}
              </p>
            )}
          </div>
          <PrimaryButton className={"signup-button"} type="submit">
            Sign Up
          </PrimaryButton>
        </form>
        <p className="note-line">
          Protected by reCAPTCHA and subject to the{" "}
          <a
            href="https://policies.google.com/privacy?hl=en-GB"
            target="_blank"
          >
            Google Privacy Policy
          </a>{" "}
          and{" "}
          <a href="https://policies.google.com/terms?hl=en-GB" target="_blank">
            Terms of Service.
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
