import React, { useState } from "react";
import "./SignUp.scss";
import { ReactSVG } from "react-svg";
import Slider from "react-slick";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/UI/PrimaryButton";
import validateSignUpForm from "../../validation/SignUp";
import AuthPageLeft from "../../components/AuthPagesComponents/AuthPageLeft";

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0,
  adaptiveHeight: true,
  autoplay: true,
  autoplaySpeed: 3000,
  dots: true,
};
const reviews = [
  {
    title: "Explore Best and Top Events on Partikarte!",
    description:
      "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.",
  },
  {
    title: "Join the Excitement at Partikarte!",
    description:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
  },
  {
    title: "Get Ready for Unforgettable Events!",
    description:
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore.",
  },
];

const initalState = {
  email: "",
  password: "",
  remember: false,
  username: "",
  businessName: "",
  businessVatNum: "",
  businessRegisteryNumber: "",
  businessAddress: "",
  city: "",
  postalCode: "",
  country: "",
};
const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initalState);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateSignUpForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // use api here
    navigate("/business/login");
    //   after submitting form
    setFormErrors({});
    setFormData(initalState);
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
          <div className={`form-item ${formErrors.businessName && "error"}`}>
            <label htmlFor="businessName">Business Name</label>
            <input
              id="businessName"
              type="text"
              name="businessName"
              value={formData.businessName}
              placeholder="Business Name"
              onChange={handleInputChange}
            />
            {formErrors.businessName && (
              <p className="error-message">{formErrors.businessName}</p>
            )}
          </div>
          <div className={`form-item ${formErrors.businessVatNum && "error"}`}>
            <label htmlFor="businessVatNum">Business VAT Number</label>
            <input
              id="businessVatNum"
              type="text"
              name="businessVatNum"
              value={formData.businessVatNum}
              placeholder="Business VAT Number"
              onChange={handleInputChange}
            />
            {formErrors.businessVatNum && (
              <p className="error-message">{formErrors.businessVatNum}</p>
            )}
          </div>
          <div
            className={`form-item ${
              formErrors.businessRegisteryNumber && "error"
            }`}
          >
            <label htmlFor="businessRegisteryNumber">
              Business Registery Number
            </label>
            <input
              id="businessRegisteryNumber"
              type="text"
              name="businessRegisteryNumber"
              value={formData.businessRegisteryNumber}
              placeholder="Business Registery Number"
              onChange={handleInputChange}
            />
            {formErrors.businessRegisteryNumber && (
              <p className="error-message">
                {formErrors.businessRegisteryNumber}
              </p>
            )}
          </div>
          <div className={`form-item ${formErrors.businessAddress && "error"}`}>
            <label htmlFor="businessAddress">Business Address</label>
            <input
              id="businessAddress"
              type="text"
              name="businessAddress"
              value={formData.businessAddress}
              placeholder="Business Address"
              onChange={handleInputChange}
            />
            {formErrors.businessAddress && (
              <p className="error-message">{formErrors.businessAddress}</p>
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
