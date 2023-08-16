import React, { useState } from "react";
import "./Company.scss";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../UI/SecondaryButton";
import { ReactSVG } from "react-svg";
import useHandleOnBlur from "../../../hooks/useHandleOnBlur";
import validateOrganizerCompanyDetails from "../../../validation/OrganizerCompanyDetails";

const Company = () => {
  const navigate = useNavigate();

  const initialState = {
    organizerName: "",
    email: "",
    phoneNumber: "",
    description: "",
    coverPhoto: null,
    profileImage: null,
  };

  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleImageUpload = (e) => {
    const name = e.target.name;
    const imageFile = e.target.files[0];
    if (imageFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setFormValues({
          ...formValues,
          [name]: event.target.result,
        });
      };
      reader.readAsDataURL(imageFile);
      if (name === "profileImage") {
        setProfileImage(imageFile);
      } else if (name === "coverPhoto") {
        setCoverPhoto(imageFile);
      }
    }
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateOrganizerCompanyDetails, setFormErrors);
  };

  console.log(formErrors, " form errors");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateOrganizerCompanyDetails(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("organizer", formValues.name);
  };

  return (
    <div className="company-details-main-container">
      <div className="company-details-header">
        <h3>Company</h3>
        <SecondaryButton onClick={handleSubmit}>
          <span>Save</span>
        </SecondaryButton>
      </div>
      <div className="company-details-main-bottom">
        <div className="company-details-images-container">
          {formValues.coverPhoto ? (
            <img src="/images/event-3.jpg" alt="" />
          ) : (
            <label htmlFor="coverPhoto" className="cover-photo-placeholder">
              <ReactSVG src="/icons/tools/add-gallery.svg" />
            </label>
          )}
          <label htmlFor="coverPhoto" className="upload-icon-container">
            <ReactSVG src="/icons/tools/upload.svg" />
          </label>
          <input
            type="file"
            name="coverPhoto"
            id="coverPhoto"
            onChange={handleImageUpload}
          />
          <div className="profile-image-container">
            <div className="image-inner-container">
              {formValues.profileImage ? (
                <img src={formValues.profileImage} />
              ) : (
                <ReactSVG
                  className="avatar-container"
                  src="/icons/tools/profile-avatar.svg"
                />
              )}
              <label htmlFor="profileImage" className="upload-icon-container">
                <ReactSVG src="/icons/tools/upload.svg" />
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>
        <form className="add-guest-form-container">
          <div className="side-by-side-guest-input">
            <div
              className={`single-form-item ${
                formErrors.organizerName ? "error" : ""
              }`}
            >
              <label htmlFor="organizerName">Organizer name</label>
              <input
                name="organizerName"
                type="text"
                id="organizerName"
                placeholder="Organizer name"
                onChange={handleInputChange}
                value={formValues.organizerName}
                onBlur={handleOnBlur}
              />
              {formErrors.organizerName && (
                <p className="error-message">{formErrors.organizerName}</p>
              )}
            </div>
            <div
              className={`single-form-item ${formErrors.email ? "error" : ""}`}
            >
              <label htmlFor="email">Email</label>
              <input
                name="email"
                type="email"
                id="email"
                placeholder="Surname"
                onChange={handleInputChange}
                value={formValues.email}
                onBlur={handleOnBlur}
              />
              {formErrors.email && (
                <p className="error-message">{formErrors.email}</p>
              )}
            </div>
            <div
              className={`single-form-item ${
                formErrors.phoneNumber ? "error" : ""
              }`}
            >
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                name="phoneNumber"
                type="number"
                id="phoneNumber"
                placeholder="Phone number"
                onChange={handleInputChange}
                value={formValues.phoneNumber}
                onBlur={handleOnBlur}
              />
              {formErrors.phoneNumber && (
                <p className="error-message">{formErrors.phoneNumber}</p>
              )}
            </div>
          </div>
          <div
            className={`single-form-item ${
              formErrors.description ? "error" : ""
            }`}
          >
            <label htmlFor="description">Description/Bio</label>
            <textarea
              name="description"
              id="description"
              placeholder="Description"
              onChange={handleInputChange}
              value={formValues.description}
              onBlur={handleOnBlur}
            />
            {formErrors.description && (
              <p className="error-message">{formErrors.description}</p>
            )}
          </div>
        </form>
        <div className="social-media-settings-container">
          <div className="social-settings-header">
            <h3>Social Media</h3>
            <SecondaryButton onClick={handleSubmit}>
              <ReactSVG src="/icons/tools/add-gallery.svg" />
              <span>Add Social Media</span>
            </SecondaryButton>
          </div>
          <div className="single-social-media-item">
            <div className="single-item-left">
              <ReactSVG src="/icons/tools/facebook-color.svg" />
              <span>Facebook</span>
              <p>www.facebook.com/678sdfkj-zs09asds98dasds0d9ui</p>
            </div>
            <div className="single-item-right">
              <ReactSVG className="button-icon" src="/icons/tools/edit.svg" />
              <ReactSVG className="button-icon" src="/icons/tools/delete.svg" />
            </div>
          </div>
          <div className="single-social-media-item">
            <div className="single-item-left">
              <ReactSVG src="/icons/tools/insta-color.svg" />
              <span>Instagram</span>
              <p>www.Instagram.com/678sdfkj-zs09asds98dasds0d9ui</p>
            </div>
            <div className="single-item-right">
              <ReactSVG className="button-icon" src="/icons/tools/edit.svg" />
              <ReactSVG className="button-icon" src="/icons/tools/delete.svg" />
            </div>
          </div>{" "}
          <div className="single-social-media-item">
            <div className="single-item-left">
              <ReactSVG src="/icons/tools/linkedin-color.svg" />
              <span>Linkedin</span>
              <p>www.linkedinwww.com/678sdfkj-zs09asds98dasds0d9ui</p>
            </div>
            <div className="single-item-right">
              <ReactSVG className="button-icon" src="/icons/tools/edit.svg" />
              <ReactSVG className="button-icon" src="/icons/tools/delete.svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company;
