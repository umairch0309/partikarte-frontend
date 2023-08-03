import React, { useState } from "react";
import "./VerifyOTP.scss";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../../../components/UI/PrimaryButton";
import AuthPageLeft from "../../../components/AuthPagesComponents/AuthPageLeft";
import validateVerifyOTPForm from "../../../validation/VerifyOTP";

const initalState = {
  otp: "",
};
const VerifyOTP = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initalState);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateVerifyOTPForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // use api here
    navigate("/business/reset-password");
    //   after submitting form
    setFormErrors({});
    setFormData(initalState);
  };

  return (
    <div className="verify-otp-page">
      <AuthPageLeft />
      <div className="verify-otp-page-right">
        <h1>Verify OTP</h1>
        <div className="top-line">
          <p>Remember password?</p>
          <Link to={"/business/login"}>Signin now.</Link>
        </div>
        <form className="verify-otp-form-container" onSubmit={handleSubmit}>
          <div className={`form-item ${formErrors.otp && "error"}`}>
            <label htmlFor="otp">OTP</label>
            <input
              id="otp"
              type="number"
              name="otp"
              value={formData.otp}
              placeholder="Input your otp"
              onChange={handleInputChange}
            />
            {formErrors.otp && (
              <p className="error-message">{formErrors.otp}</p>
            )}
          </div>

          <PrimaryButton type="submit">Submit OTP</PrimaryButton>
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

export default VerifyOTP;
