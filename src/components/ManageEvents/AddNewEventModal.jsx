import React, { useEffect, useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./ModalForm.scss";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import PrimaryButton from "../UI/PrimaryButton";
import { ReactSVG } from "react-svg";
import { AddNewEventSchema } from "../../validation/AddNewEvent";
import AutocompleteInput from "../service-components/AutoCompleteInput";
import { useCountriesList } from "../../api/services";
import { usePostApi } from "../../hooks/api-hooks/usePostApi";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";

const initialState = {
  title: "",
  description: "",
  category: "",
  eventType: "Venue",
  venueName: "",
  address: "",
  eventBanner: "",
  country: "",
  city: "",
  postalCode: "",
  startingDate: "",
  endingDate: "",
  lng: "",
  lat: "",
  eventLink: "",
};

const AddNewEventModal = ({
  setShowAddNewEventModal,
  showAddNewEventModal,
}) => {
  const isMobile = useIsMobileWidth();
  const [imageToUpload, setImageToUpload] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [countries, setCountries] = useState([]);

  const { isLoading: countriesLoading } = useCountriesList(
    (res) => {
      setCountries(res);
    },
    (res) => {
      console.log(res, "countries list error");
    }
  );
  const { handleMutation, isLoading: isEventCreating } = usePostApi();
  const queryClient = useQueryClient();

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("eventName", values.title);
    formData.append("eventStart", values.startingDate);
    formData.append("eventEnd", values.endingDate);
    formData.append("eventType", values.eventType);
    formData.append("eventCategory", values.category);
    formData.append("eventVenue", values.venueName);
    formData.append("eventDescription", values.description);
    formData.append("eventBanner", imageToUpload);

    if (values?.eventType === "Venue") {
      formData.append("addressDescription", values.address);
      formData.append("city", values.city);
      formData.append("postalCode", values.postalCode);
      formData.append("country", values.country);
      formData.append("eventCoordinatesX", values.lng);
      formData.append("eventCoordinatesY", values.lat);
    }
    if (values?.eventType === "Online") {
      formData.append("eventLink", values.eventLink);
    }

    handleMutation(
      {
        path: "events/new-event",
        data: formData,
      },
      (res) => {
        queryClient.invalidateQueries({ queryKey: ["get-all-events"] });
        setShowAddNewEventModal(false);
        resetForm();
      },
      (res) => {}
    );
  };

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: AddNewEventSchema,
    onSubmit: handleSubmit,
  });

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        formik.setFieldValue("eventBanner", event.target.result);
      };
      reader.readAsDataURL(imageFile);
      setImageToUpload(imageFile);
    }
  };

  useEffect(() => {
    if (selectedPlace) {
      formik.setValues({
        ...formik.values,
        address: selectedPlace.formatted_address,
        country: selectedPlace.country,
        city: selectedPlace.city,
        postalCode: selectedPlace.postal_code,
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
      });
    }
  }, [selectedPlace]);

  return (
    <CustomModal
      onCancel={() => setShowAddNewEventModal(false)}
      open={showAddNewEventModal}
      onOk={() => setShowAddNewEventModal(false)}
      title={"Add Events"}
      subtitle={"Please enter the information to add Events."}
      width={!isMobile && 900}
    >
      <form
        className="add-new-event-form-container"
        onSubmit={formik.handleSubmit}
      >
        <div className="add-new-event-header">
          <div className="new-event-header-left">
            {!formik.values.eventBanner ? (
              <label
                htmlFor="upload-event-banner"
                className={`event-banner-placeholder-box ${
                  formik.errors.eventBanner ? "image-error" : ""
                }`}
              >
                Click to upload
              </label>
            ) : (
              <div className="event-banner-image-container">
                <img src={formik.values.eventBanner} />
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
                formik.touched.startingDate && formik.errors.startingDate
                  ? "error"
                  : ""
              }`}
            >
              <label htmlFor="startingDate">Starting (Date-Time)</label>
              <input
                name="startingDate"
                type="datetime-local"
                id="startingDate"
                placeholder="Select date and time..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.startingDate}
              />

              {formik.touched.startingDate && formik.errors.startingDate && (
                <p className="error-message">{formik.errors.startingDate}</p>
              )}
            </div>
            <div
              className={`single-form-item ${
                formik.touched.endingDate && formik.errors.endingDate
                  ? "error"
                  : ""
              }`}
            >
              <label htmlFor="endingDate">Ending (Date-Time)</label>
              <input
                name="endingDate"
                type="datetime-local"
                id="endingDate"
                placeholder="Select date and time..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.endingDate}
              />
              {formik.touched.endingDate && formik.errors.endingDate && (
                <p className="error-message">{formik.errors.endingDate}</p>
              )}
            </div>
          </div>
        </div>
        <div className="side-by-side-guest-input">
          {formik.errors.eventBanner && (
            <p className="image-error-message">{formik.errors.eventBanner}</p>
          )}
          {formik.errors.dateDifference && (
            <p className="date-diff-error-message">
              {formik.errors.dateDifference}
            </p>
          )}
        </div>
        <div
          className={`single-form-item ${
            formik.touched.title && formik.errors.title ? "error" : ""
          }`}
        >
          <label htmlFor="title">Event Title</label>
          <input
            name="title"
            type="text"
            id="title"
            placeholder="Enter event title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="error-message">{formik.errors.title}</p>
          )}
        </div>
        <div
          className={`single-form-item ${
            formik.touched.description && formik.errors.description
              ? "error"
              : ""
          }`}
        >
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            type="text"
            id="description"
            placeholder="Describe the event..."
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="error-message">{formik.errors.description}</p>
          )}
        </div>
        <div className="side-by-side-guest-input">
          <div
            className={`single-form-item ${
              formik.touched.category && formik.errors.category ? "error" : ""
            }`}
          >
            <label htmlFor="category">Event Category</label>
            <input
              name="category"
              type="text"
              id="category"
              placeholder="Enter event category"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.category}
            />
            {formik.touched.category && formik.errors.category && (
              <p className="error-message">{formik.errors.category}</p>
            )}
          </div>
          <div
            className={`single-form-item ${
              formik.touched.eventType && formik.errors.eventType ? "error" : ""
            }`}
          >
            <label htmlFor="eventType">Event Type</label>
            <select
              name="eventType"
              id="eventType"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.eventType}
            >
              <option value="">Choose event type</option>
              <option value="Venue">Venue</option>
              <option value="Online">Online</option>
            </select>
            {formik.touched.eventType && formik.errors.eventType && (
              <p className="select-error-message">{formik.errors.eventType}</p>
            )}
          </div>
        </div>
        <div
          className={`single-form-item ${
            formik.touched.venueName && formik.errors.venueName ? "error" : ""
          }`}
        >
          <label htmlFor="venueName">Venue Name</label>
          <input
            name="venueName"
            type="text"
            id="venueName"
            placeholder="Enter venue name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.venueName}
          />
          {formik.touched.venueName && formik.errors.venueName && (
            <p className="error-message">{formik.errors.venueName}</p>
          )}
        </div>
        {formik.values.eventType === "Venue" && (
          <>
            {" "}
            <div
              className={`single-form-item ${
                formik.touched.address && formik.errors.address ? "error" : ""
              }`}
            >
              <label htmlFor="address">Address</label>
              <AutocompleteInput
                name="address"
                type="text"
                placeholder="Enter address"
                id="address"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                onPlaceSelect={handlePlaceSelect}
                value={formik.values.address}
              />

              {formik.touched.address && formik.errors.address && (
                <p className="error-message">{formik.errors.address}</p>
              )}
            </div>
            <div className="side-by-side-guest-input">
              <div
                className={`single-form-item ${
                  formik.touched.country && formik.errors.country ? "error" : ""
                }`}
              >
                <label htmlFor="country">Choose country</label>
                <select
                  name="country"
                  id="country"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.country}
                >
                  <option value="">Choose country</option>
                  {!countriesLoading &&
                    countries?.length > 0 &&
                    countries?.map((el) => (
                      <option value={el?.countryName}>{el?.countryName}</option>
                    ))}
                </select>
                {formik.touched.country && formik.errors.country && (
                  <p className="error-message">{formik.errors.country}</p>
                )}
              </div>
              <div
                className={`single-form-item ${
                  formik.touched.city && formik.errors.city ? "error" : ""
                }`}
              >
                <label htmlFor="city">City/State</label>
                <input
                  name="city"
                  type="text"
                  id="city"
                  placeholder="City name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.city}
                />

                {formik.touched.city && formik.errors.city && (
                  <p className="error-message">{formik.errors.city}</p>
                )}
              </div>
              <div
                className={`single-form-item ${
                  formik.touched.postalCode && formik.errors.postalCode
                    ? "error"
                    : ""
                }`}
              >
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  name="postalCode"
                  type="text"
                  id="postalCode"
                  placeholder="Postal code"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.postalCode}
                />
                {formik.touched.postalCode && formik.errors.postalCode && (
                  <p className="error-message">{formik.errors.postalCode}</p>
                )}
              </div>
            </div>
          </>
        )}
        {formik.values.eventType === "Online" && (
          <div
            className={`single-form-item ${
              formik.touched.eventLink && formik.errors.eventLink ? "error" : ""
            }`}
          >
            <label htmlFor="eventLink">Event Link</label>
            <input
              name="eventLink"
              type="text"
              id="eventLink"
              placeholder="Enter venue name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.eventLink}
            />
            {formik.touched.eventLink && formik.errors.eventLink && (
              <p className="error-message">{formik.errors.eventLink}</p>
            )}
          </div>
        )}
        <PrimaryButton
          disabled={isEventCreating}
          className={"form-submit-button"}
        >
          Confirm
        </PrimaryButton>
      </form>
    </CustomModal>
  );
};

export default AddNewEventModal;
