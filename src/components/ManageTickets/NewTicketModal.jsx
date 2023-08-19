import React, { useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./ModalForm.scss";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import PrimaryButton from "../UI/PrimaryButton";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";
import { Switch } from "antd";
import validateNewTicket from "../../validation/NewTicket";

const initialState = {
  ticketName: "",
  ticketPrice: 0,
  vatPercentage: 0,
  numberOfTickets: 0,
  descriptionOnWeb: "",
  descriptionOnTicket: "",
  startingDate: "",
  endingDate: "",
  paidTicket: true,
  limitedTickets: true,
};

const NewTicketModal = ({ setShowNewTicketModal, showNewTicketModal }) => {
  const isMobile = useIsMobileWidth();
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateNewTicket, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateNewTicket(formValues);
    if (Object.keys(errors).length > 0) {
      const newErrors = Object.entries(errors).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;
    }

    const formData = new FormData();
    formData.append("title", formValues.name);
    setShowNewTicketModal(false);
  };

  return (
    <CustomModal
      onCancel={() => setShowNewTicketModal(false)}
      open={showNewTicketModal}
      onOk={() => setShowNewTicketModal(false)}
      title={"Add Tickets"}
      subtitle={"Please enter the information to add tickets in list."}
      width={!isMobile && 700}
    >
      <form className="add-new-ticket-form-container" onSubmit={handleSubmit}>
        <div className="side-by-side-ticket-input"></div>
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
        <div className="side-by-side-ticket-input">
          <div
            className={`single-form-item ${
              formErrors.startingDate ? "error" : ""
            }`}
          >
            <label htmlFor="startingDate">Valid from</label>
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
            <label htmlFor="endingDate">Valid to</label>
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
        <div className="side-by-side-ticket-input">
          <div className="side-by-side-multiple-header-input">
            <div
              className={`single-form-item ${
                formErrors.ticketPrice ? "error" : ""
              }`}
            >
              <label htmlFor="ticketPrice">Ticket Price</label>
              <input
                name="ticketPrice"
                type="number"
                id="ticketPrice"
                placeholder="Enter ticket price"
                onChange={handleInputChange}
                value={formValues.ticketPrice || 0}
                onBlur={handleOnBlur}
                disabled={!formValues.paidTicket}
                min={0}
              />
              {formErrors.ticketPrice && (
                <p className="error-message">{formErrors.ticketPrice}</p>
              )}
            </div>
            <div
              className={`single-form-item switch-form-item ${
                formErrors.vatPercentage ? "error" : ""
              }`}
            >
              <div className="switch-label-container">
                <label
                  htmlFor="vatPercentage"
                  className={formValues.paidTicket ? "inactive-label" : ""}
                >
                  Free
                </label>
                <Switch
                  size="small"
                  checked={formValues.paidTicket}
                  onChange={(e) => {
                    handleInputChange({
                      target: { name: "paidTicket", value: e },
                    });
                    handleOnBlur({
                      target: { name: "paidTicket", value: e },
                    });
                  }}
                />
                <label
                  className={!formValues.paidTicket ? "inactive-label" : ""}
                >
                  Paid
                </label>
              </div>
              <input
                name="vatPercentage"
                type="number"
                id="vatPercentage"
                placeholder="VAT%"
                min={0}
                onChange={handleInputChange}
                value={formValues.vatPercentage || 0}
                onBlur={handleOnBlur}
                disabled={!formValues.paidTicket}
              />
              {formErrors.vatPercentage && (
                <p className="error-message">{formErrors.vatPercentage}</p>
              )}
            </div>
          </div>
          <div
            className={`single-form-item ${
              formErrors.numberOfTickets ? "error" : ""
            }`}
          >
            <div className="side-by-side-multiple-header-input">
              <label htmlFor="numberOfTickets">No. of Tickets</label>
              <div className="switch-label-container">
                <label
                  htmlFor="numberOfTickets"
                  className={formValues.limitedTickets ? "inactive-label" : ""}
                >
                  Unlimited
                </label>
                <Switch
                  size="small"
                  checked={formValues.limitedTickets}
                  onChange={(e) => {
                    handleInputChange({
                      target: { name: "limitedTickets", value: e },
                    });
                    handleOnBlur({
                      target: { name: "limitedTickets", value: e },
                    });
                  }}
                />
                <label
                  className={formValues.limitedTickets ? "" : "inactive-label"}
                  htmlFor="numberOfTickets"
                >
                  Limited
                </label>
              </div>
            </div>

            <input
              name="numberOfTickets"
              type={formValues.limitedTickets ? "number" : "text"}
              id="numberOfTickets"
              placeholder="Enter No. of Tickets"
              min={"0"}
              onChange={handleInputChange}
              value={
                formValues.limitedTickets
                  ? formValues.numberOfTickets || 0
                  : "Unlimited"
              }
              onBlur={handleOnBlur}
              disabled={!formValues.limitedTickets}
            />
            {formErrors.numberOfTickets && (
              <p className="error-message">{formErrors.numberOfTickets}</p>
            )}
          </div>
        </div>

        <div
          className={`single-form-item ${
            formErrors.descriptionOnWeb ? "error" : ""
          }`}
        >
          <label htmlFor="descriptionOnWeb">
            Description <span className="inactive-label">(on the web)</span>
          </label>
          <textarea
            name="descriptionOnWeb"
            type="text"
            id="descriptionOnWeb"
            placeholder="Describe the event..."
            onChange={handleInputChange}
            value={formValues.descriptionOnWeb}
            onBlur={handleOnBlur}
          />
          {formErrors.descriptionOnWeb && (
            <p className="error-message">{formErrors.descriptionOnWeb}</p>
          )}
        </div>
        <div
          className={`single-form-item ${
            formErrors.descriptionOnTicket ? "error" : ""
          }`}
        >
          <label htmlFor="descriptionOnTicket">
            Description
            <span className="inactive-label"> (on the ticket)</span>
          </label>
          <textarea
            name="descriptionOnTicket"
            type="text"
            id="descriptionOnTicket"
            placeholder="Describe the event..."
            onChange={handleInputChange}
            value={formValues.descriptionOnTicket}
            onBlur={handleOnBlur}
          />
          {formErrors.descriptionOnTicket && (
            <p className="error-message">{formErrors.descriptionOnTicket}</p>
          )}
        </div>

        <PrimaryButton className={"form-submit-button"}>Confirm</PrimaryButton>
      </form>
    </CustomModal>
  );
};

export default NewTicketModal;
