import React, { useState } from "react";
import "./ForgotPassword.scss";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../../../components/UI/PrimaryButton";
import validateForgotPasswordForm from "../../../validation/ForgotPassword";
import AuthPageLeft from "../../../components/AuthPagesComponents/AuthPageLeft";

const initalState = {
  email: "",
};
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initalState);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    const errors = await validateForgotPasswordForm({ [name]: value });
    if (Object.keys(errors).length > 0) {
      setFormErrors({ ...formErrors, [name]: errors[name] });
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateForgotPasswordForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // use api here
    navigate("/business/verify-otp");
    //   after submitting form
    setFormErrors({});
    setFormData(initalState);
  };

  return (
    <div className="forgot-password-page">
      <AuthPageLeft />
      <div className="forgot-password-page-right">
        <h1>Forgot Password</h1>
        <div className="top-line">
          <p>Remember password?</p>
          <Link to={"/business/login"}>Signin now.</Link>
        </div>
        <form
          className="forgot-password-form-container"
          onSubmit={handleSubmit}
        >
          <div className={`form-item ${formErrors.email && "error"}`}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              placeholder="Input your email"
              onChange={handleInputChange}
            />
            {formErrors.email && (
              <p className="error-message">{formErrors.email}</p>
            )}
          </div>

          <PrimaryButton type="submit">Submit Request</PrimaryButton>
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

export default ForgotPassword;
