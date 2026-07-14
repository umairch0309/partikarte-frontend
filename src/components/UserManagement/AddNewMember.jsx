import React, { useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./ModalForm.scss";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import PrimaryButton from "../UI/PrimaryButton";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";
import { ReactSVG } from "react-svg";
import validateAddNewMember from "../../validation/AddNewMember";
import { useQueryClient } from "@tanstack/react-query";
import { usePostApi } from "../../hooks/api-hooks/usePostApi";
import { useCountriesList } from "../../api/services";
import { useAllRoles } from "../../api/roles";

const initialState = {
  name: "",
  surname: "",
  email: "",
  memberType: "",
  frontSideImage: "",
  backSideImage: "",
  address: "",
  country: "",
  city: "",
  postalCode: "",
  dateOfBirth: "",
  permissions: "",
};

const AddNewMember = ({ setShowAddNewMember, showAddNewMember }) => {
  const isMobile = useIsMobileWidth();
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [frontSideImage, setFrontSideImage] = useState(null);
  const [backSideImage, setBackSideImage] = useState(null);
  const [countries, setCountries] = useState([]);
  const [roles, setRoles] = useState([]);

  const { isLoading: countriesLoading } = useCountriesList(
    (res) => {
      setCountries(Array.isArray(res) ? res : []);
    },
    (res) => {
      console.log(res, "countries list error");
    }
  );

  const { isLoading: isRolesLoading } = useAllRoles((res) => {
    setRoles(Array.isArray(res?.roles) ? res.roles : []);
  });

  const { handleMutation, isLoading: isEventCreating } = usePostApi();
  const queryClient = useQueryClient();

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    const name = e.target.name;
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormValues({
          ...formValues,
          [name]: event.target.result,
        });
      };
      reader.readAsDataURL(imageFile);
      name === "frontSideImage"
        ? setFrontSideImage(imageFile)
        : setBackSideImage(imageFile);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateAddNewMember, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateAddNewMember(formValues);
    console.log(errors);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    } else {
      setFormErrors({});
    }

    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("surname", formValues.surname);
    formData.append("email", formValues.email);
    formData.append("role", formValues.memberType);
    formData.append("permissions", formValues.permissions);
    formData.append("dob", formValues.dateOfBirth);
    formData.append("guestType", formValues.guestType);
    formData.append("addressDescription", formValues.address);
    formData.append("city", formValues.city);
    formData.append("postalCode", formValues.postalCode);
    formData.append("country", formValues.country);
    formData.append("IDFront", frontSideImage);
    formData.append("IDBack", backSideImage);

    setFormErrors({});

    handleMutation(
      {
        path: `business/business-managers/add`,
        data: formData,
      },
      (res) => {
        queryClient.invalidateQueries({
          queryKey: ["get-all-business-managers"],
        });
        setShowAddNewMember(false);
        setFormValues(initialState);
        setFrontSideImage(null);
        setBackSideImage(null);
      },
      (res) => {}
    );
  };

  return (
    <CustomModal
      onCancel={() => setShowAddNewMember(false)}
      open={showAddNewMember}
      onOk={() => setShowAddNewMember(false)}
      title={"Add Members"}
      subtitle={"Please enter the information to add members in list."}
      width={!isMobile && 700}
    >
      <form className="add-new-member-form-container" onSubmit={handleSubmit}>
        <div className="side-by-side-guest-input">
          <div className={`single-form-item ${formErrors.name ? "error" : ""}`}>
            <label htmlFor="name">Name*</label>
            <input
              name="name"
              type="text"
              id="name"
              placeholder="Enter name"
              onChange={handleInputChange}
              value={formValues.name}
              onBlur={handleOnBlur}
            />
            {formErrors.name && (
              <p className="error-message">{formErrors.name}</p>
            )}
          </div>
          <div
            className={`single-form-item ${formErrors.surname ? "error" : ""}`}
          >
            <label htmlFor="surname">Surname*</label>
            <input
              name="surname"
              type="text"
              id="surname"
              placeholder="Enter surname"
              onChange={handleInputChange}
              value={formValues.surname}
              onBlur={handleOnBlur}
            />
            {formErrors.surname && (
              <p className="error-message">{formErrors.surname}</p>
            )}
          </div>
        </div>

        <div className={`single-form-item ${formErrors.email ? "error" : ""}`}>
          <label htmlFor="email">Email*</label>
          <input
            name="email"
            type="email"
            id="email"
            placeholder="Enter email"
            onChange={handleInputChange}
            value={formValues.email}
            onBlur={handleOnBlur}
          />
          {formErrors.email && (
            <p className="error-message">{formErrors.email}</p>
          )}
        </div>

        <div className="side-by-side-guest-input">
          <div
            className={`single-form-item ${
              formErrors.memberType ? "error" : ""
            }`}
          >
            <label htmlFor="memberType">Member Type*</label>
            <select
              onChange={handleInputChange}
              name="memberType"
              id="memberType"
              value={formValues.memberType}
              onBlur={handleOnBlur}
            >
              <option value="">Choose member type</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
              <option value="business manager">Business Manager</option>
            </select>
            {formErrors.memberType && (
              <p className="select-error-message">{formErrors.memberType}</p>
            )}
          </div>
          <div
            className={`single-form-item ${
              formErrors.dateOfBirth ? "error" : ""
            }`}
          >
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              name="dateOfBirth"
              type="date"
              id="dateOfBirth"
              placeholder="Select date"
              onChange={handleInputChange}
              value={formValues.dateOfBirth}
              onBlur={handleOnBlur}
            />

            {formErrors.dateOfBirth && (
              <p className="select-error-message">{formErrors.dateOfBirth}</p>
            )}
          </div>
        </div>

        <div
          className={`single-form-item ${formErrors.address ? "error" : ""}`}
        >
          <label htmlFor="address">Address</label>
          <input
            name="address"
            type="text"
            id="address"
            placeholder="Enter address"
            onChange={handleInputChange}
            value={formValues.address}
            onBlur={handleOnBlur}
          />
          {formErrors.address && (
            <p className="error-message">{formErrors.address}</p>
          )}
        </div>

        <div
          className={`single-form-item ${
            formErrors.permissions ? "error" : ""
          }`}
        >
          <label htmlFor="permissions">Choose permissions role*</label>
          <select
            onChange={handleInputChange}
            name="permissions"
            id="permissions"
            value={formValues.permissions}
            onBlur={handleOnBlur}
          >
            <option value="">Choose permissions</option>
            {!isRolesLoading &&
              roles?.length > 0 &&
              roles?.map((el) => <option value={el?._id}>{el?.name}</option>)}
          </select>
          {formErrors.permissions && (
            <p className="select-error-message">{formErrors.permissions}</p>
          )}
        </div>

        <div className="side-by-side-guest-input">
          <div
            className={`single-form-item ${formErrors.country ? "error" : ""}`}
          >
            <label htmlFor="country">Choose country</label>
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
            className={`single-form-item ${
              formErrors.postalCode ? "error" : ""
            }`}
          >
            <label htmlFor="postalCode">Postal Code</label>
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

        <div className="add-new-member-images-container">
          <div className="single-image-upload-item">
            {!formValues.frontSideImage ? (
              <label
                htmlFor="frontSideImage"
                className={`id-placeholder-box ${
                  formErrors.frontSideImage ? "image-error" : ""
                }`}
              >
                Click to upload FRONT SIDE OF ID*
              </label>
            ) : (
              <div className="id-image-container">
                <img src={formValues.frontSideImage} />
                <label
                  htmlFor="frontSideImage"
                  className="upload-icon-container"
                >
                  <ReactSVG src="/icons/tools/upload.svg" />
                </label>
              </div>
            )}
            <input
              id="frontSideImage"
              name="frontSideImage"
              className="image-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          <div className="single-image-upload-item">
            {!formValues.backSideImage ? (
              <label
                htmlFor="backSideImage"
                className={`id-placeholder-box ${
                  formErrors.backSideImage ? "image-error" : ""
                }`}
              >
                Click to upload BACK SIDE OF ID*
              </label>
            ) : (
              <div className="id-image-container">
                <img src={formValues.backSideImage} />
                <label
                  htmlFor="backSideImage"
                  className="upload-icon-container"
                >
                  <ReactSVG src="/icons/tools/upload.svg" />
                </label>
              </div>
            )}
            <input
              id="backSideImage"
              className="image-input"
              name="backSideImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <PrimaryButton className={"form-submit-button"}>Confirm</PrimaryButton>
      </form>
    </CustomModal>
  );
};

export default AddNewMember;
