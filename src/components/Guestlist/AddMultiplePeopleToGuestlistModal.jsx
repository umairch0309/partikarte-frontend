import React, { useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./ModalForm.scss";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import PrimaryButton from "../UI/PrimaryButton";
import validateAddMultiplePeopleToGuest from "../../validation/AddMultiplePeopleToGuest";

const initialState = {
  guestInfo: "",
  guestType: "",
  notifyPeople: false,
};

const AddMultiplePeopleToGuestlistModal = ({
  setShowAddPeopleModal,
  setShowMultiplePeopleModal,
  showMultiplePeopleModal,
}) => {
  const isMobile = useIsMobileWidth();
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    const errors = await validateAddMultiplePeopleToGuest({ [name]: value });
    if (Object.keys(errors).length > 0) {
      setFormErrors({ ...formErrors, [name]: errors[name] });
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateAddMultiplePeopleToGuest(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("guestInfo", formValues.guestInfo);
    formData.append("guestType", formValues.guestType);
    formData.append("notifyPeople", formValues.notifyPeople);
  };

  return (
    <CustomModal
      onCancel={() => setShowMultiplePeopleModal(false)}
      open={showMultiplePeopleModal}
      onOk={() => setShowMultiplePeopleModal(false)}
      title={"Add Multiple Guests"}
      subtitle={
        "Please add Guest Name & Surname and press enter to make it as new line to same guest."
      }
      width={!isMobile && 700}
    >
      <form className="add-guest-form-container" onSubmit={handleSubmit}>
        <div
          className={`single-form-item ${formErrors.guestInfo ? "error" : ""}`}
        >
          <label htmlFor="guestInfo">Guest Info*</label>
          <textarea
            name="guestInfo"
            id="guestInfo"
            placeholder="Enter guests information and press enter to save next guest..."
            onChange={handleInputChange}
            value={formValues.guestInfo}
          />
          {formErrors.guestInfo && (
            <p className="error-message">{formErrors.guestInfo}</p>
          )}
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
          <div className="single-form-item radio-input-container">
            <input
              className="radio-input"
              name="notifyPeople"
              type="radio"
              id="notifyPeople"
              onChange={handleInputChange}
              value={formValues.notifyPeople}
            />
            <label htmlFor="notifyPeople">Notify people</label>
          </div>
          <div className="side-by-side-guest-input">
            <button
              onClick={() => {
                setShowMultiplePeopleModal(false);
                setShowAddPeopleModal(true);
              }}
              type="button"
              className="add-multiple-button"
            >
              Add single guest
            </button>
            <PrimaryButton>Confirm</PrimaryButton>
          </div>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddMultiplePeopleToGuestlistModal;
