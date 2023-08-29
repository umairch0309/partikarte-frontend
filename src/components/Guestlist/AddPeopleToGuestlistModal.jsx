import React, { useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./ModalForm.scss";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import PrimaryButton from "../UI/PrimaryButton";
import validateAddPeopleToGuest from "../../validation/AddPeopleToGuest";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";
import { useQueryClient } from "@tanstack/react-query";
import { usePostApi } from "../../hooks/api-hooks/usePostApi";

const initialState = {
  name: "",
  surname: "",
  guestType: "",
  email: "",
  phoneNumber: "",
  notifyPeople: "false",
};

const AddPeopleToGuestlistModal = ({
  showAddPeopleModal,
  setShowAddPeopleModal,
  setShowMultiplePeopleModal,
  selectedEvent,
}) => {
  const isMobile = useIsMobileWidth();
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});

  const { handleMutation, isLoading: isEventCreating } = usePostApi();
  const queryClient = useQueryClient();

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateAddPeopleToGuest, setFormErrors);
  };

  console.log(formValues);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateAddPeopleToGuest(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("surname", formValues.surname);
    formData.append("guestType", formValues.guestType);
    formData.append("email", formValues.email);
    formData.append("phoneNumber", formValues.phoneNumber);
    formData.append(
      "isNotified",
      formValues.notifyPeople === "true" ? true : false
    );
    formData.append("eventId", selectedEvent?._id);

    setFormErrors({});

    handleMutation(
      {
        path: "guests/new-guest",
        data: formData,
      },
      (res) => {
        queryClient.invalidateQueries(selectedEvent?._id);
        setShowAddPeopleModal(false);
        setFormValues(initialState);
      },
      (res) => {}
    );
  };

  return (
    <CustomModal
      onCancel={() => {
        setFormValues(initialState);
        setFormErrors({});
        setShowAddPeopleModal(false);
      }}
      open={showAddPeopleModal}
      onOk={() => setShowAddPeopleModal(false)}
      title={"Add Guest"}
      subtitle={"Please enter the information to add guest in list."}
      width={!isMobile && 700}
    >
      <form className="add-guest-form-container" onSubmit={handleSubmit}>
        <div className="side-by-side-guest-input">
          <div className={`single-form-item ${formErrors.name ? "error" : ""}`}>
            <label htmlFor="name">Name*</label>
            <input
              name="name"
              type="text"
              id="name"
              placeholder="Name"
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
              placeholder="Surname"
              onChange={handleInputChange}
              value={formValues.surname}
              onBlur={handleOnBlur}
            />
            {formErrors.surname && (
              <p className="error-message">{formErrors.surname}</p>
            )}
          </div>
        </div>
        <div
          className={`single-form-item ${formErrors.guestType ? "error" : ""}`}
        >
          <label htmlFor="guestType">Guest Type*</label>
          <select
            onChange={handleInputChange}
            name="guestType"
            id="guestType"
            value={formValues.guestType}
            onBlur={handleOnBlur}
          >
            <option value="">Choose guest type</option>
            <option value="vip">VIP</option>
            <option value="vvip">VVIP</option>
            <option value="economy">Economy</option>
          </select>
          {formErrors.guestType && (
            <p className="select-error-message">{formErrors.guestType}</p>
          )}
        </div>
        <div className="side-by-side-guest-input">
          <div
            className={`single-form-item ${formErrors.email ? "error" : ""}`}
          >
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              id="email"
              placeholder="Email address"
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
        <div className="side-by-side-guest-input">
          <div className="single-form-item radio-input-container">
            <input
              className="radio-input"
              name="notifyPeople"
              type="radio"
              id="notifyPeople"
              onChange={handleInputChange}
              value={formValues.notifyPeople}
              onBlur={handleOnBlur}
            />
            <label htmlFor="notifyPeople">Notify people</label>
          </div>
          <div className="side-by-side-guest-input">
            {/* <button
              onClick={() => {
                setShowAddPeopleModal(false);
                setShowMultiplePeopleModal(true);
              }}
              type="button"
              className="add-multiple-button"
            >
              Add multiple guests
            </button> */}
            <PrimaryButton>Confirm</PrimaryButton>
          </div>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddPeopleToGuestlistModal;
