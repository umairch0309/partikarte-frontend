import React, { useState } from "react";
import { Skeleton } from "antd";
import "./SettingsForm.scss";
import PrimaryButton from "../UI/PrimaryButton";
import validateAccountInformation from "../../validation/AccountInformation";
import { ReactSVG } from "react-svg";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";
import { usePutApi } from "../../hooks/api-hooks/usePutApi";
import { useProfileDetails } from "../../api/profile";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../context/auth-context";

const initialState = {
  oldPassword: "",
  newPassword: "",
  email: "",
  username: "",
};

const AccountInformation = () => {
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState([false, false]);
  const [data, setData] = useState(null);

  const { isLoggedIn, setIsLoggedIn } = useAuthContext();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const { response, isLoading: profileLoading } = useProfileDetails((res) => {
    setData(res?.data);
    setFormValues((prevState) => ({
      ...prevState,
      username: res?.data?.user?.username,
      email: res?.data?.user?.email,
    }));
  });

  const { handleMutation, isLoading: isProfileUpdating } = usePutApi();
  const queryClient = useQueryClient();

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const formData = new FormData();
      formData.append("profile_image", imageFile);
      handleMutation(
        {
          path: "business/update-profile",
          data: formData,
        },
        (res) => {
          queryClient.invalidateQueries("auth/get-profile");
        }
      );
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateAccountInformation, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateAccountInformation(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const formData = new FormData();
    formData.append("password", formValues.oldPassword);
    formData.append("newPassword", formValues.newPassword);
    handleMutation(
      {
        path: "auth/change-password",
        data: formData,
      },
      (res) => {
        handleLogout();
      },
      (res) => {
        setFormErrors({ oldPassword: "Incorrect", newPassword: "Incorrect" });
      }
    );
    setFormValues((prevState) => ({
      ...prevState,
      newPassword: "",
      oldPassword: "",
    }));
  };

  return (
    <form className="business-settings-form" onSubmit={handleSubmit}>
      <h3>Account Information</h3>

      <div className="account-info-image-container">
        {profileLoading || isProfileUpdating ? (
          <Skeleton.Avatar active={true} size={150} shape={"circle"} />
        ) : data?.user?.profile_image ? (
          <img src={data?.user?.profile_image} />
        ) : (
          <ReactSVG
            className="avatar-container"
            src="/icons/tools/profile-avatar.svg"
          />
        )}

        <input
          type="file"
          id="profileImage"
          onChange={(e) => handleImageUpload(e)}
        />
        <label htmlFor="profileImage" className="upload-icon-container">
          <ReactSVG src="/icons/tools/upload.svg" />
        </label>

        <div className="image-upload-guides">
          <h5>Upload Photo</h5>
          <p>300x300 and max 2 MB</p>
        </div>
      </div>

      <div className="side-by-side-settings-input">
        <div
          className={`single-form-item ${formErrors.username ? "error" : ""}`}
        >
          <label htmlFor="username">Username</label>

          <input
            name="username"
            type="text"
            id="username"
            placeholder="Username"
            onChange={() => {}}
            disabled
            value={formValues.username}
            onBlur={handleOnBlur}
          />

          {formErrors.username && (
            <p className="error-message">{formErrors.username}</p>
          )}
        </div>
        <div className={`single-form-item ${formErrors.email ? "error" : ""}`}>
          <label htmlFor="email">Email Address</label>
          <input
            name="email"
            type="text"
            id="email"
            placeholder="Email Address"
            onChange={() => {}}
            disabled
            onBlur={handleOnBlur}
            value={formValues.email}
          />
          {formErrors.email && (
            <p className="error-message">{formErrors.email}</p>
          )}
        </div>
      </div>

      <div className="heading-sub-heading-container">
        <h3>Change Password</h3>
        <p>
          To change the password enter the old password and new one, then click
          Save password
        </p>
      </div>

      <div className="side-by-side-settings-input">
        <div
          className={`single-form-item ${
            formErrors.oldPassword ? "error" : ""
          }`}
        >
          <label htmlFor="oldPassword">Old Password</label>
          <input
            name="oldPassword"
            type={showPasswords[0] ? "text" : "password"}
            id="oldPassword"
            placeholder="Old Password"
            onChange={handleInputChange}
            value={formValues.oldPassword}
            onBlur={handleOnBlur}
          />
          {formErrors.oldPassword && (
            <p className="select-error-message">{formErrors.oldPassword}</p>
          )}
          <ReactSVG
            onClick={() =>
              setShowPasswords([!showPasswords[0], showPasswords[1]])
            }
            className="show-password-icon"
            src="/icons/tools/eye.svg"
          />
        </div>
        <div
          className={`single-form-item ${
            formErrors.newPassword ? "error" : ""
          }`}
        >
          <label htmlFor="newPassword">New Password</label>
          <input
            name="newPassword"
            type={showPasswords[1] ? "text" : "password"}
            id="newPassword"
            placeholder="New Password"
            onChange={handleInputChange}
            value={formValues.newPassword}
            onBlur={handleOnBlur}
          />
          {formErrors.newPassword && (
            <p className="select-error-message">{formErrors.newPassword}</p>
          )}
          <ReactSVG
            onClick={() =>
              setShowPasswords([showPasswords[0], !showPasswords[1]])
            }
            className="show-password-icon"
            src="/icons/tools/eye.svg"
          />
        </div>
      </div>

      <PrimaryButton
        disabled={isProfileUpdating || profileLoading}
        className={"settings-form-submit-button"}
      >
        Save password
      </PrimaryButton>
    </form>
  );
};

export default AccountInformation;
