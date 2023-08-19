import React, { useState } from "react";
import "./SignIn.scss";
import { ReactSVG } from "react-svg";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../../../components/UI/PrimaryButton";
import validateSignInForm from "../../../validation/SignIn";
import AuthPageLeft from "../../../components/AuthPagesComponents/AuthPageLeft";
import useHandleOnBlur from "../../../hooks/useHandleOnBlur";

const initalState = {
  email: "",
  password: "",
  remember: false,
};
const SignIn = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initalState);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateSignInForm, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateSignInForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // use api here

    localStorage.setItem("token", "token1234567890987654321");
    setIsLoggedIn(true);

    navigate("/business/dashboard");

    //   after submitting form
    setFormErrors({});
    setFormData(initalState);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <div className="sign-in-page">
      <AuthPageLeft />
      <div className="sign-in-page-right">
        <h1>Sign In</h1>
        <div className="top-line">
          <p>New user?</p>
          <Link to={"/business/signup"}>Create an account</Link>
        </div>
        <form className="sign-in-form-container" onSubmit={handleSubmit}>
          <div className={`form-item ${formErrors.email && "error"}`}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              placeholder="Input your email"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
            />
            {formErrors.email && (
              <p className="error-message">{formErrors.email}</p>
            )}
          </div>
          <div className={`form-item ${formErrors.password && "error"}`}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              placeholder="Input your password"
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
          <div className="top-line">
            <div className="form-item top-line">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={formData.remember}
                onChange={handleInputChange}
              />
              <label htmlFor="remember">Remember me?</label>
            </div>
            <Link className="forgot-password" to={"/business/forgot-password"}>
              Forgot password?
            </Link>
          </div>
          <PrimaryButton type="submit">Sign In</PrimaryButton>
        </form>

        <div className="sign-in-options-divider">
          <hr />
          <p>or</p>
          <hr />
        </div>
        <button className="google-sign-in-button">
          <ReactSVG src="/icons/tools/google-logo.svg" />
          <p>Sign in with Google</p>
        </button>
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

export default SignIn;
