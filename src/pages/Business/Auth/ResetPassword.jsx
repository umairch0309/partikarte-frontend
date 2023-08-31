import React, { useEffect, useState } from "react";
import "./ResetPassword.scss";
import { ReactSVG } from "react-svg";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../../../components/UI/PrimaryButton";
import AuthPageLeft from "../../../components/AuthPagesComponents/AuthPageLeft";
import validateConfirmPasswordForm from "../../../validation/ResetPassword";
import useHandleOnBlur from "../../../hooks/useHandleOnBlur";
import { useAuthContext } from "../../../context/auth-context";
import { usePostApi } from "../../../hooks/api-hooks/usePostApi";

const initalState = {
  password: "",
  confirmPassword: "",
  email: "",
};
const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState(initalState);
  const [formErrors, setFormErrors] = useState({});

  const { forgotEmail, setForgotEmail } = useAuthContext();

  useEffect(() => {
    if (forgotEmail) {
      setFormData({ ...formData, email: forgotEmail });
    }
  });

  const { handleMutation, isLoading } = usePostApi();

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateConfirmPasswordForm, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateConfirmPasswordForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    if (formData?.confirmPassword !== formData?.password) {
      setFormErrors({ ...formErrors, match: "Passwords do not match." });
      return;
    }
    // use api here
    setFormErrors({});

    handleMutation(
      {
        path: "auth/reset-password",
        data: formData,
      },
      (res) => {
        setFormErrors({});
        setFormData(initalState);
        setForgotEmail(null);
        navigate("/business/login");
      },
      (res) => {}
    );
  };

  return (
    <div className="reset-password-page">
      <AuthPageLeft />
      <div className="reset-password-page-right">
        <h1>Reset Password</h1>
        <div className="top-line">
          <p>Remember password?</p>
          <Link to={"/business/login"}>Signin now.</Link>
        </div>
        <form className="reset-password-form-container" onSubmit={handleSubmit}>
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
              onClick={() => setShowPassword(!showPassword)}
              className="show-password"
              src="/icons/tools/eye.svg"
            />
            {formErrors.password && (
              <p className="error-message">{formErrors.password}</p>
            )}
          </div>
          <div className={`form-item ${formErrors.confirmPassword && "error"}`}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              placeholder="Input your confirmed password"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
            />
            <ReactSVG
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="show-password"
              src="/icons/tools/eye.svg"
            />
            {formErrors.confirmPassword && (
              <p className="error-message">{formErrors.confirmPassword}</p>
            )}
          </div>

          {formErrors.match && (
            <p className="error-message">{formErrors.match}</p>
          )}

          <PrimaryButton disabled={isLoading} type="submit">
            Submit New Password
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

export default ResetPassword;
