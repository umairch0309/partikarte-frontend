import React, { useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./ModalForm.scss";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import PrimaryButton from "../UI/PrimaryButton";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";
import { ReactSVG } from "react-svg";
import validateAddNewEvent from "../../validation/AddNewEvent";

const initialState = {
  title: "",
  description: "",
  category: "",
  eventType: "",
  venueName: "",
  address: "",
  eventBanner: "",
  country: "",
  city: "",
  postalCode: "",
  startingDate: "",
  endingDate: "",
};

const AddNewEventModal = ({
  setShowAddNewEventModal,
  showAddNewEventModal,
}) => {
  const isMobile = useIsMobileWidth();
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [imageToUpload, setImageToUpload] = useState(null);

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setFormValues({
          ...formValues,
          eventBanner: event.target.result,
        });
      };
      reader.readAsDataURL(imageFile);
      setImageToUpload(imageFile);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateAddNewEvent, setFormErrors);
    if (["startingDate", "endingDate"].includes(e.target.name)) {
      const errors = await validateAddNewEvent({
        startingDate: formValues.startingDate,
        endingDate: formValues.endingDate,
        dateDifference: "",
      });
      if (Object.keys(errors).length > 0) {
        setFormErrors({
          dateDifference: errors.dateDifference,
          startingDate: errors.startingDate,
          endingDate: errors.endingDate,
        });
        return;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateAddNewEvent(formValues);
    console.log(errors);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    } else {
      setFormErrors({});
    }

    const formData = new FormData();
    formData.append("title", formValues.name);
    setShowAddNewEventModal(false);
  };

  return (
    <CustomModal
      onCancel={() => setShowAddNewEventModal(false)}
      open={showAddNewEventModal}
      onOk={() => setShowAddNewEventModal(false)}
      title={"Add Events"}
      subtitle={"Please enter the information to add Events."}
      width={!isMobile && 900}
    >
      <form className="add-new-event-form-container" onSubmit={handleSubmit}>
        <div className="add-new-event-header">
          <div className="new-event-header-left">
            {!formValues.eventBanner ? (
              <label
                htmlFor="upload-event-banner"
                className={`event-banner-placeholder-box ${
                  formErrors.eventBanner ? "image-error" : ""
                }`}
              >
                Click to upload
              </label>
            ) : (
              <div className="event-banner-image-container">
                <img src={formValues.eventBanner} />
                <label
                  htmlFor="upload-event-banner"
                  className="upload-icon-container"
                >
                  <ReactSVG src="/icons/tools/upload.svg" />
                </label>
              </div>
            )}
            <input
              id="upload-event-banner"
              className="image-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div className="image-upload-guides">
              <h5>Upload Event Banner</h5>
              <p>1920x1080 and max 8 MB</p>
            </div>
          </div>
          <div className="new-event-header-right">
            <div
              className={`single-form-item ${
                formErrors.startingDate ? "error" : ""
              }`}
            >
              <label htmlFor="startingDate">Starting (Date-Time)</label>
              <input
                name="startingDate"
                type="datetime-local"
                id="startingDate"
                placeholder="Select date and time..."
                onChange={handleInputChange}
                value={formValues.startingDate}
                onBlur={handleOnBlur}
              />

              {formErrors.startingDate && (
                <p className="error-message">{formErrors.startingDate}</p>
              )}
            </div>
            <div
              className={`single-form-item ${
                formErrors.endingDate ? "error" : ""
              }`}
            >
              <label htmlFor="endingDate">Ending (Date-Time)</label>
              <input
                name="endingDate"
                type="datetime-local"
                id="endingDate"
                placeholder="Select date and time..."
                onChange={handleInputChange}
                value={formValues.endingDate}
                onBlur={handleOnBlur}
              />
              {formErrors.endingDate && (
                <p className="error-message">{formErrors.endingDate}</p>
              )}
            </div>
          </div>
        </div>
        <div className="side-by-side-guest-input">
          {formErrors.eventBanner && (
            <p className="image-error-message">{formErrors.eventBanner}</p>
          )}
          {formErrors.dateDifference && (
            <p className="date-diff-error-message">
              {formErrors.dateDifference}
            </p>
          )}
        </div>
        <div className={`single-form-item ${formErrors.title ? "error" : ""}`}>
          <label htmlFor="title">Event Title</label>
          <input
            name="title"
            type="text"
            id="title"
            placeholder="Enter event title"
            onChange={handleInputChange}
            value={formValues.title}
            onBlur={handleOnBlur}
          />
          {formErrors.title && (
            <p className="error-message">{formErrors.title}</p>
          )}
        </div>
        <div
          className={`single-form-item ${
            formErrors.description ? "error" : ""
          }`}
        >
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            type="text"
            id="description"
            placeholder="Describe the event..."
            onChange={handleInputChange}
            value={formValues.description}
            onBlur={handleOnBlur}
          />
          {formErrors.description && (
            <p className="error-message">{formErrors.description}</p>
          )}
        </div>
        <div className="side-by-side-guest-input">
          <div
            className={`single-form-item ${formErrors.category ? "error" : ""}`}
          >
            <label htmlFor="category">Choose category</label>
            <select
              onChange={handleInputChange}
              name="category"
              id="category"
              value={formValues.category}
              onBlur={handleOnBlur}
            >
              <option value="">Choose category</option>
              <option value="vip">VIP</option>
              <option value="vvip">VVIP</option>
              <option value="economy">Economy</option>
            </select>
            {formErrors.category && (
              <p className="select-error-message">{formErrors.category}</p>
            )}
          </div>
          <div
            className={`single-form-item ${
              formErrors.eventType ? "error" : ""
            }`}
          >
            <label htmlFor="eventType">Event Type</label>
            <select
              onChange={handleInputChange}
              name="eventType"
              id="eventType"
              value={formValues.eventType}
              onBlur={handleOnBlur}
            >
              <option value="">Choose event type</option>
              <option value="vip">VIP</option>
              <option value="vvip">VVIP</option>
              <option value="economy">Economy</option>
            </select>
            {formErrors.eventType && (
              <p className="select-error-message">{formErrors.eventType}</p>
            )}
          </div>
        </div>
        <div
          className={`single-form-item ${formErrors.venueName ? "error" : ""}`}
        >
          <label htmlFor="venueName">Venue Name</label>
          <input
            name="venueName"
            type="text"
            id="venueName"
            placeholder="Enter venue name"
            onChange={handleInputChange}
            value={formValues.venueName}
            onBlur={handleOnBlur}
          />
          {formErrors.venueName && (
            <p className="error-message">{formErrors.venueName}</p>
          )}
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
              <option value="vip">USA</option>
              <option value="vvip">UK</option>
              <option value="economy">Slovakia</option>
            </select>
            {formErrors.country && (
              <p className="select-error-message">{formErrors.country}</p>
            )}
          </div>
          <div className={`single-form-item ${formErrors.city ? "error" : ""}`}>
            <label htmlFor="city">City/State</label>
            <select
              onChange={handleInputChange}
              name="city"
              id="city"
              value={formValues.city}
              onBlur={handleOnBlur}
            >
              <option value="">Choose city</option>
              <option value="vip">New York</option>
              <option value="vvip">Washington DC</option>
              <option value="economy">London</option>
            </select>
            {formErrors.city && (
              <p className="select-error-message">{formErrors.city}</p>
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
        <PrimaryButton className={"form-submit-button"}>Confirm</PrimaryButton>
      </form>
    </CustomModal>
  );
};

export default AddNewEventModal;
