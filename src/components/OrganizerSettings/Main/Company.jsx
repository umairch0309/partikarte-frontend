import React, { useState } from "react";
import "./Company.scss";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../UI/SecondaryButton";
import { ReactSVG } from "react-svg";
import useHandleOnBlur from "../../../hooks/useHandleOnBlur";
import validateOrganizerCompanyDetails from "../../../validation/OrganizerCompanyDetails";
import AddSocialMedia from "../Forms/AddSocialMedia";
import { usePatchApi } from "../../../hooks/api-hooks/usePatchApi";
import { useProfileDetails } from "../../../api/profile";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "antd";
import { useDeleteApi } from "../../../hooks/api-hooks/useDeleteApi";

const initialState = {
  companyName: "",
  email: "",
  phoneNumber: "",
  description: "",
  coverPhoto: null,
  profileImage: null,
};

const Company = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [showAddSocialMedia, setShowAddSocialMedia] = useState(false);
  const [data, setData] = useState(null);
  const [initialStateForEditSocialMedia, setInitialStateForEditSocialMedia] =
    useState({
      platform: "",
      link: "",
    });

  const { response, isLoading: profileLoading } = useProfileDetails((res) => {
    const profile = res?.user ? res : res?.data;
    if (!profile) return;

    setData(profile);
    setFormValues({
      companyName: profile?.business?.company?.companyName || "",
      email: profile?.business?.contactInformation?.email || "",
      phoneNumber: profile?.business?.contactInformation?.phoneNumber || "",
      description: profile?.business?.description || "",
      profileImage: profile?.business?.organizerImage || null,
      coverPhoto: profile?.business?.organizerImageBanner || null,
    });
  });

  const { handleMutation, isLoading: isProfileUpdating } = usePatchApi();
  const { handleMutation: handleDeleteMutation, isLoading: isDeleting } =
    useDeleteApi();

  const queryClient = useQueryClient();

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

  const handleEditClick = (platform, link) => {
    setInitialStateForEditSocialMedia({ platform, link });
    setShowAddSocialMedia(true);
  };

  const handleDeleteClick = (platform) => {
    // Handle delete functionality
    if (!isDeleting) {
      handleDeleteMutation(
        {
          path: `business/delete-social-link/${platform}`,
        },
        (res) => {
          queryClient.invalidateQueries("get-profile");
        },
        (res) => {}
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateOrganizerCompanyDetails(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const formData = new FormData();
    formData.append("companyName", formValues.companyName);
    formData.append("email", formValues.email);
    formData.append("phoneNumber", formValues.phoneNumber);
    formData.append("description", formValues.description);
    formData.append("organizerImage", profileImage);
    formData.append("organizerImageBanner", coverPhoto);

    handleMutation(
      {
        path: "business/organizer-details/update",
        data: formData,
      },
      (res) => {
        queryClient.invalidateQueries("get-profile");
      },
      (res) => {}
    );
  };

  return (
    <div className="company-details-main-container">
      <div className="company-details-header">
        <h3>Company</h3>
        <SecondaryButton type={"submit"} onClick={handleSubmit}>
          <span>Save</span>
        </SecondaryButton>
      </div>
      <div className="company-details-main-bottom">
        <div className="company-details-images-container">
          {isProfileUpdating || profileLoading ? (
            <Skeleton.Node
              active={true}
              style={{ width: "100%", height: "180px" }}
            ></Skeleton.Node>
          ) : formValues.coverPhoto ? (
            <img src={formValues.coverPhoto} alt="" />
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
              {isProfileUpdating || profileLoading ? (
                <Skeleton.Avatar active={true} size={96} shape={"circle"} />
              ) : formValues.profileImage ? (
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
        <form className="company-details-form-container">
          <div className="side-by-side-guest-input">
            <div
              className={`single-form-item ${
                formErrors.companyName ? "error" : ""
              }`}
            >
              <label htmlFor="companyName">Organizer name</label>
              <input
                name="companyName"
                type="text"
                id="companyName"
                placeholder="Organizer name"
                onChange={handleInputChange}
                value={formValues.companyName}
                onBlur={handleOnBlur}
              />
              {formErrors.companyName && (
                <p className="error-message">{formErrors.companyName}</p>
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
            <SecondaryButton
              onClick={() => setShowAddSocialMedia(true)}
              type={"button"}
            >
              <ReactSVG src="/icons/tools/add-gallery.svg" />
              <span>Add Social Media</span>
            </SecondaryButton>
          </div>
          {data?.business?.socialLinks &&
            Object.keys(data?.business?.socialLinks).map((platform) => (
              <SingleSocialMediaItem
                key={platform}
                platform={platform}
                link={data?.business?.socialLinks[platform]}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />
            ))}
        </div>
      </div>
      <AddSocialMedia
        setShowAddSocialMedia={setShowAddSocialMedia}
        showAddSocialMedia={showAddSocialMedia}
        initialStateForEditSocialMedia={initialStateForEditSocialMedia}
      />
    </div>
  );
};

export default Company;

function SingleSocialMediaItem({ platform, link, onEditClick, onDeleteClick }) {
  return (
    <div className="single-social-media-item">
      <div className="single-item-left">
        <ReactSVG src={`/icons/tools/${platform}-color.svg`} />
        <span>{platform}</span>
        <p>{link}</p>
      </div>
      <div className="single-item-right">
        <ReactSVG
          onClick={() => {
            onEditClick(platform, link);
          }}
          className="button-icon"
          src="/icons/tools/edit.svg"
        />
        <ReactSVG
          onClick={() => {
            onDeleteClick(platform);
          }}
          className="button-icon"
          src="/icons/tools/delete.svg"
        />
      </div>
    </div>
  );
}
