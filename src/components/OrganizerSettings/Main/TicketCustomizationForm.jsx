import React, { useEffect, useState } from "react";
import "./TicketCustomizationForm.scss";
import { ReactSVG } from "react-svg";
import SecondaryButton from "../../UI/SecondaryButton";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "antd";
import useHandleOnBlur from "../../../hooks/useHandleOnBlur";
import validateTicketCustomizationForm from "../../../validation/TicketCustomizationForm";
import { useCountriesList } from "../../../api/services";
import { usePutApi } from "../../../hooks/api-hooks/usePutApi";
import DateTimeLocalConverter from "../../../utilities/DateTimeLocalConverter";

const initialState = {
  logo: "",
  organizerName: "",
  organizerAddress: "",
  organizerPostalCode: "",
  organizerCountry: "",
  organizerCity: "",
  companyName: "",
  companyVAT: "",
  companyAddress: "",
  companyPostalCode: "",
  companyCountry: "",
  companyCity: "",
  ticketName: "",
  emailContent: "",
  eventAddress: "",
  eventPostalCode: "",
  eventCountry: "",
  eventCity: "",
  entryTimeWithTicket: "",
  eventStart: "",
  eventEnd: "",
  showCompanyInfo: true,
  showOrganizerInfo: true,
};

const TicketCustomizationForm = ({ selectedTicket }) => {
  const navigate = useNavigate();
  const [logoImage, setLogoImage] = useState(null);
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [countries, setCountries] = useState([]);

  const { isLoading: countriesLoading } = useCountriesList(
    (res) => {
      setCountries(res);
    },
    (res) => {
      console.log(res, "countries list error");
    }
  );

  const { handleMutation, isLoading: isUpdating } = usePutApi();

  useEffect(() => {
    if (selectedTicket?.ticket && selectedTicket?.ticket?.ticketAppearance) {
      const appearance = selectedTicket?.ticket?.ticketAppearance;
      //   console.log(appearance, " appearance");
      setFormValues({
        logo: appearance?.logo || "",
        organizerName: appearance?.organizerName || "",
        organizerAddress:
          appearance?.organizerAddress?.addressDescription || "",
        organizerPostalCode: appearance?.organizerAddress?.postalCode || "",
        organizerCountry: appearance?.organizerAddress?.country || "",
        organizerCity: appearance?.organizerAddress?.city || "",
        companyName: appearance?.companyName || "",
        companyVAT: appearance?.companyVAT || "",
        companyAddress: appearance?.companyAddress?.addressDescription || "",
        companyPostalCode: appearance?.companyAddress?.postalCode || "",
        companyCountry: appearance?.companyAddress?.country || "",
        companyCity: appearance?.companyAddress?.city || "",
        ticketName: appearance?.ticketName || "",
        emailContent: appearance?.emailContent || "",
        eventAddress: appearance?.eventAddress?.addressDescription || "",
        eventPostalCode: appearance?.eventAddress?.postalCode || "",
        eventCountry: appearance?.eventAddress?.country || "",
        eventCity: appearance?.eventAddress?.city || "",
        entryTimeWithTicket:
          DateTimeLocalConverter(appearance?.entryTimeWithTicket) || "",
        eventStart: DateTimeLocalConverter(appearance?.eventStart) || "",
        eventEnd: DateTimeLocalConverter(appearance?.eventEnd) || "",
        showCompanyInfo: appearance?.showCompanyInfo || true,
        showOrganizerInfo: appearance?.showOrganizerInfo || true,
      });
    } else {
      navigate("/business/organizer-settings/tickets-customization");
    }
  }, [selectedTicket]);

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormValues((prevState) => ({
          ...prevState,
          logo: event.target.result,
        }));
      };
      reader.readAsDataURL(imageFile);
      setLogoImage(imageFile);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const newValue = e.target.type === "checkbox" ? e.target.checked : value;
    setFormValues({ ...formValues, [name]: newValue });
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateTicketCustomizationForm, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateTicketCustomizationForm(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    console.log(formValues, "formvalues");

    const formData = new FormData();
    for (const key in formValues) {
      if (key !== "logo") {
        formData.append(key, formValues[key]);
      }
    }

    if (logoImage) {
      formData.append("logo", logoImage);
    } else {
      formData.append("logo", formValues.logo);
    }

    handleMutation(
      {
        path: `/event/${selectedTicket?.eventId}/tickets/update-ticket-appearance/${selectedTicket?.ticket?._id}`,
        data: formData,
      },
      (res) => {
        // setFormValues(initialState);
      },
      (res) => {}
    );
  };

  return (
    <div className="ticket-customization-form">
      <div className="customization-form-header">
        <div className="header-left">
          <ReactSVG
            onClick={() => navigate(-1)}
            src="/icons/tools/left-arrow.svg"
          />
          <h3>Customize Ticket</h3>
        </div>
        <div className="header-right">
          <SecondaryButton disabled={isUpdating} onClick={handleSubmit}>
            Save
          </SecondaryButton>
        </div>
      </div>
      <form className="ticket-customization-form-container">
        <div className="logo-image-container">
          {formValues?.logo ? (
            <img src={formValues?.logo} />
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
            <h5>Logo image</h5>
            <p>300x300 and max 2 MB</p>
          </div>
        </div>
        <div className="form-section-heading">
          <h3>Organizer</h3>
          <div className={`checkbox-input-item`}>
            <input
              name="showOrganizerInfo"
              type="checkbox"
              id="showOrganizerInfo"
              onChange={handleInputChange}
              checked={formValues.showOrganizerInfo}
            />
            <label htmlFor="showOrganizerInfo">Show organizer info</label>
          </div>
        </div>
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
          className={`single-form-item ${
            formErrors.organizerAddress ? "error" : ""
          }`}
        >
          <label htmlFor="organizerAddress">Organizer Address</label>
          <input
            name="organizerAddress"
            type="text"
            id="organizerAddress"
            placeholder="Address"
            onChange={handleInputChange}
            value={formValues.organizerAddress}
            onBlur={handleOnBlur}
          />
          {formErrors.organizerAddress && (
            <p className="error-message">{formErrors.organizerAddress}</p>
          )}
        </div>
        <div className="side-by-side-settings-input">
          <div
            className={`single-form-item ${
              formErrors.organizerCountry ? "error" : ""
            }`}
          >
            <label htmlFor="guestType">Country</label>
            <select
              onChange={handleInputChange}
              name="organizerCountry"
              id="organizerCountry"
              value={formValues.organizerCountry}
              onBlur={handleOnBlur}
            >
              <option value="">Choose country</option>
              {!countriesLoading &&
                countries?.length > 0 &&
                countries?.map((el) => (
                  <option value={el?.countryName}>{el?.countryName}</option>
                ))}
            </select>
            {formErrors.organizerCountry && (
              <p className="select-error-message">
                {formErrors.organizerCountry}
              </p>
            )}
          </div>
          <div
            className={`single-form-item ${
              formErrors.organizerCity ? "error" : ""
            }`}
          >
            <label htmlFor="organizerCity">City</label>
            <input
              id="organizerCity"
              type="text"
              name="organizerCity"
              value={formValues.organizerCity}
              placeholder="City"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
            />
            {formErrors.organizerCity && (
              <p className="error-message">{formErrors.organizerCity}</p>
            )}
          </div>
          <div
            className={`single-form-item ${
              formErrors.organizerPostalCode ? "error" : ""
            }`}
          >
            <label htmlFor="organizerPostalCode">Postal code</label>
            <input
              name="organizerPostalCode"
              type="number"
              id="organizerPostalCode"
              placeholder="Postal code"
              onChange={handleInputChange}
              value={formValues.organizerPostalCode}
              onBlur={handleOnBlur}
            />
            {formErrors.organizerPostalCode && (
              <p className="error-message">{formErrors.organizerPostalCode}</p>
            )}
          </div>
        </div>

        <div className="form-section-heading">
          <h3>Company</h3>
          <div className={`checkbox-input-item`}>
            <input
              name="showCompanyInfo"
              type="checkbox"
              id="showCompanyInfo"
              onChange={handleInputChange}
              checked={formValues.showCompanyInfo}
            />
            <label htmlFor="showCompanyInfo">Show company info</label>
          </div>
        </div>
        <div className="side-by-side-settings-input">
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
              // onChange={handleInputChange}
              value={formValues.companyName}
              onBlur={handleOnBlur}
              disabled
            />
            {formErrors.companyName && (
              <p className="error-message">{formErrors.companyName}</p>
            )}
          </div>
          <div
            className={`single-form-item ${
              formErrors.companyVAT ? "error" : ""
            }`}
          >
            <label htmlFor="companyVAT">VAT number</label>
            <input
              name="companyVAT"
              type="number"
              id="companyVAT"
              placeholder="VAT number"
              // onChange={handleInputChange}
              value={formValues.companyVAT}
              onBlur={handleOnBlur}
              disabled
            />
            {formErrors.companyVAT && (
              <p className="error-message">{formErrors.companyVAT}</p>
            )}
          </div>
        </div>
        <div
          className={`single-form-item ${
            formErrors.companyAddress ? "error" : ""
          }`}
        >
          <label htmlFor="companyAddress">Address</label>
          <input
            name="companyAddress"
            type="text"
            id="companyAddress"
            placeholder="Address"
            // onChange={handleInputChange}
            value={formValues.companyAddress}
            onBlur={handleOnBlur}
            disabled
          />
          {formErrors.companyAddress && (
            <p className="error-message">{formErrors.companyAddress}</p>
          )}
        </div>
        <div className="side-by-side-settings-input">
          <div
            className={`single-form-item ${
              formErrors.companyCountry ? "error" : ""
            }`}
          >
            <label htmlFor="guestType">Country</label>
            <select
              // onChange={handleInputChange}
              name="companyCountry"
              id="companyCountry"
              value={formValues.companyCountry}
              onBlur={handleOnBlur}
              disabled
            >
              <option value="">Choose country</option>
              {!countriesLoading &&
                countries?.length > 0 &&
                countries?.map((el) => (
                  <option value={el?.countryName}>{el?.countryName}</option>
                ))}
            </select>
            {formErrors.companyCountry && (
              <p className="select-error-message">
                {formErrors.companyCountry}
              </p>
            )}
          </div>
          <div
            className={`single-form-item ${
              formErrors.companyCity ? "error" : ""
            }`}
          >
            <label htmlFor="companyCity">City</label>
            <input
              id="companyCity"
              type="text"
              name="companyCity"
              value={formValues.companyCity}
              placeholder="City"
              // onChange={handleInputChange}
              onBlur={handleOnBlur}
              disabled
            />
            {formErrors.companyCity && (
              <p className="error-message">{formErrors.companyCity}</p>
            )}
          </div>
          <div
            className={`single-form-item ${
              formErrors.companyPostalCode ? "error" : ""
            }`}
          >
            <label htmlFor="companyPostalCode">Postal code</label>
            <input
              name="companyPostalCode"
              type="number"
              id="companyPostalCode"
              placeholder="Postal code"
              // onChange={handleInputChange}
              value={formValues.companyPostalCode}
              onBlur={handleOnBlur}
              disabled
            />
            {formErrors.companyPostalCode && (
              <p className="error-message">{formErrors.companyPostalCode}</p>
            )}
          </div>
        </div>

        <div className="form-section-heading">
          <h3>Event</h3>
        </div>
        <div
          className={`single-form-item ${formErrors.ticketName ? "error" : ""}`}
        >
          <label htmlFor="ticketName">Ticket Name*</label>
          <input
            name="ticketName"
            type="text"
            id="ticketName"
            placeholder="Enter ticket name"
            onChange={handleInputChange}
            value={formValues.ticketName}
            onBlur={handleOnBlur}
          />
          {formErrors.ticketName && (
            <p className="error-message">{formErrors.ticketName}</p>
          )}
        </div>
        <div
          className={`single-form-item ${
            formErrors.emailContent ? "error" : ""
          }`}
        >
          <label htmlFor="emailContent">Email Content</label>
          <input
            name="emailContent"
            type="text"
            id="emailContent"
            placeholder="Enter email content"
            onChange={handleInputChange}
            value={formValues.emailContent}
            onBlur={handleOnBlur}
          />
          {formErrors.emailContent && (
            <p className="error-message">{formErrors.emailContent}</p>
          )}
        </div>
        <div
          className={`single-form-item ${
            formErrors.eventAddress ? "error" : ""
          }`}
        >
          <label htmlFor="eventAddress">Venue Address</label>
          <input
            name="eventAddress"
            type="text"
            id="eventAddress"
            placeholder="Address"
            onChange={handleInputChange}
            value={formValues.eventAddress}
            onBlur={handleOnBlur}
          />
          {formErrors.eventAddress && (
            <p className="error-message">{formErrors.eventAddress}</p>
          )}
        </div>
        <div className="side-by-side-settings-input">
          <div
            className={`single-form-item ${
              formErrors.eventCountry ? "error" : ""
            }`}
          >
            <label htmlFor="guestType">Venue Country</label>
            <select
              onChange={handleInputChange}
              name="eventCountry"
              id="eventCountry"
              value={formValues.eventCountry}
              onBlur={handleOnBlur}
            >
              <option value="">Choose country</option>
              {!countriesLoading &&
                countries?.length > 0 &&
                countries?.map((el) => (
                  <option value={el?.countryName}>{el?.countryName}</option>
                ))}
            </select>
            {formErrors.eventCountry && (
              <p className="select-error-message">{formErrors.eventCountry}</p>
            )}
          </div>
          <div
            className={`single-form-item ${
              formErrors.eventCity ? "error" : ""
            }`}
          >
            <label htmlFor="eventCity">Venue City</label>
            <input
              id="eventCity"
              type="text"
              name="eventCity"
              value={formValues.eventCity}
              placeholder="City"
              onChange={handleInputChange}
              onBlur={handleOnBlur}
            />
            {formErrors.eventCity && (
              <p className="error-message">{formErrors.eventCity}</p>
            )}
          </div>
          <div
            className={`single-form-item ${
              formErrors.eventPostalCode ? "error" : ""
            }`}
          >
            <label htmlFor="eventPostalCode">Venue Postal code</label>
            <input
              name="eventPostalCode"
              type="number"
              id="eventPostalCode"
              placeholder="Postal code"
              onChange={handleInputChange}
              value={formValues.eventPostalCode}
              onBlur={handleOnBlur}
            />
            {formErrors.eventPostalCode && (
              <p className="error-message">{formErrors.eventPostalCode}</p>
            )}
          </div>
        </div>
        <div className="side-by-side-settings-input">
          <div
            className={`single-form-item ${
              formErrors.entryTimeWithTicket ? "error" : ""
            }`}
          >
            <label htmlFor="entryTimeWithTicket">Entry time with ticket</label>
            <input
              name="entryTimeWithTicket"
              type="datetime-local"
              id="entryTimeWithTicket"
              placeholder="Select entry time with ticket"
              onChange={handleInputChange}
              value={formValues.entryTimeWithTicket}
              onBlur={handleOnBlur}
            />

            {formErrors.entryTimeWithTicket && (
              <p className="error-message">{formErrors.entryTimeWithTicket}</p>
            )}
          </div>

          <div
            className={`single-form-item ${
              formErrors.eventStart ? "error" : ""
            }`}
          >
            <label htmlFor="eventStart">Valid from</label>
            <input
              name="eventStart"
              type="datetime-local"
              id="eventStart"
              placeholder="Select date and time..."
              onChange={handleInputChange}
              value={formValues.eventStart}
              onBlur={handleOnBlur}
            />

            {formErrors.eventStart && (
              <p className="error-message">{formErrors.eventStart}</p>
            )}
          </div>
          <div
            className={`single-form-item ${formErrors.eventEnd ? "error" : ""}`}
          >
            <label htmlFor="eventEnd">Valid to</label>
            <input
              name="eventEnd"
              type="datetime-local"
              id="eventEnd"
              placeholder="Select date and time..."
              onChange={handleInputChange}
              value={formValues.eventEnd}
              onBlur={handleOnBlur}
            />

            {formErrors.eventEnd && (
              <p className="error-message">{formErrors.eventEnd}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default TicketCustomizationForm;
