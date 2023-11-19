import React, { useEffect, useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./ModalForm.scss";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import PrimaryButton from "../UI/PrimaryButton";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";
import { Switch, message } from "antd";
import validateNewTicket from "../../validation/NewTicket";
import { usePostApi } from "../../hooks/api-hooks/usePostApi";
import { useQueryClient } from "@tanstack/react-query";
import DateTimeLocalConverter from "../../utilities/DateTimeLocalConverter";
import { usePutApi } from "../../hooks/api-hooks/usePutApi";

const initialState = {
  ticketName: "",
  ticketType: "",
  ticketPrice: 0,
  vatPercentage: 0,
  numberOfTickets: 0,
  descriptionOnWeb: "",
  descriptionOnTicket: "",
  startingDate: "",
  endingDate: "",
  paidTicket: true,
  limitedTickets: true,
  questions: [],
};

const NewTicketModal = ({
  selectedEvent,
  setShowNewTicketModal,
  showNewTicketModal,
  setTicketEditStatus,
  selectedTicket,
  ticketEditStatus,
}) => {
  const isMobile = useIsMobileWidth();
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});

  const { handleMutation, isLoading: isEventCreating } = usePostApi();
  const { handleMutation: handleUpdateTicket, isLoading: isEventUpdating } =
    usePutApi();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedTicket && ticketEditStatus) {
      setFormValues((prevState) => ({
        ...prevState,
        ticketName: selectedTicket?.ticketName,
        ticketType: selectedTicket?.ticketType,
        ticketPrice: selectedTicket?.price,
        vatPercentage: selectedTicket?.vatPercentage,
        numberOfTickets: selectedTicket?.maxCapacity,
        descriptionOnWeb: selectedTicket?.descriptionWeb,
        descriptionOnTicket: selectedTicket?.descriptionTicket,
        startingDate: DateTimeLocalConverter(selectedTicket?.validFrom),
        endingDate: DateTimeLocalConverter(selectedTicket?.validTo),
        paidTicket: selectedTicket?.paymentType === "paid",
        limitedTickets: selectedTicket?.capacityLimitation === "limited",
        questions: selectedTicket?.questions || [],
      }));
    }
  }, [selectedEvent, ticketEditStatus]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    if (name === "paidTicket && value === false") {
      setFormValues({ ...formValues, vatPercentage: 0, ticketPrice: 0 });
    } else if (name === "limitedTickets" && value === false) {
      setFormValues({ ...formValues, numberOfTickets: 0 });
    }
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateNewTicket, setFormErrors);
  };

  const addQuestionHandler = () => {
    setFormValues((prev) => ({
      ...formValues,
      questions: [
        ...prev.questions,
        {
          label: "",
        },
      ],
    }));
  };

  const handleQuestionLabelChange = (value, index) => {
    setFormValues((prev) => ({
      ...formValues,
      questions: prev.questions.map((question, i) => {
        if (i === index) {
          return {
            ...question,
            label: value,
          };
        } else {
          return question;
        }
      }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateNewTicket(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    } else {
      setFormErrors({});
    }

    if (
      selectedTicket?._id &&
      ticketEditStatus &&
      selectedTicket?.ticketOrders > formValues.numberOfTickets
    ) {
      message.warning(
        `Ticket has already been order ${selectedTicket?.ticketOrders} many times.`
      );
      return;
    }

    const formData = {
      ticketName: formValues.ticketName,
      validFrom: formValues.startingDate,
      validTo: formValues.endingDate,
      maxCapacity: formValues.numberOfTickets,
      capacityLimitation: formValues.limitedTickets,
      paidTicket: formValues.paidTicket,
      price: formValues.ticketPrice,
      vatPercentage: formValues.vatPercentage,
      ticketType: formValues.ticketType,
      descriptionWeb: formValues.descriptionOnWeb,
      descriptionTicket: formValues.descriptionOnTicket,
      questions: formValues.questions,
    };

    setFormErrors({});

    if (selectedTicket?._id && ticketEditStatus) {
      handleUpdateTicket(
        {
          path: `/event/${selectedEvent?._id}/tickets/update/${selectedTicket?._id}`,
          data: formData,
        },
        (res) => {
          queryClient.invalidateQueries({
            queryKey: ["get-all-events", selectedEvent?._id],
          });
          setShowNewTicketModal(false);
          setTicketEditStatus(false);
          setFormValues(initialState);
        },
        (res) => {}
      );
    } else {
      handleMutation(
        {
          path: `/event/${selectedEvent?._id}/tickets/new-ticket`,
          data: formData,
        },
        (res) => {
          queryClient.invalidateQueries({
            queryKey: ["get-all-events", selectedEvent?._id],
          });
          setShowNewTicketModal(false);
          setFormValues(initialState);
        },
        (res) => {}
      );
    }
  };

  console.log(formValues);

  return (
    <CustomModal
      onCancel={() => {
        setFormValues(initialState);
        setFormErrors({});
        setShowNewTicketModal(false);
        setTicketEditStatus(false);
      }}
      open={showNewTicketModal}
      onOk={() => {
        setShowNewTicketModal(false);
        setTicketEditStatus(false);
      }}
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
                onChange={(e) =>
                  formValues.paidTicket ? handleInputChange(e) : () => {}
                }
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
                onChange={(e) =>
                  formValues.paidTicket ? handleInputChange(e) : () => {}
                }
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
              onChange={(e) =>
                formValues.limitedTickets ? handleInputChange(e) : () => {}
              }
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
          className={`single-form-item ${formErrors.ticketType ? "error" : ""}`}
        >
          <label htmlFor="ticketType">Ticket Type*</label>
          <select
            onChange={handleInputChange}
            name="ticketType"
            id="ticketType"
            value={formValues.ticketType}
            onBlur={handleOnBlur}
          >
            <option value="">Choose guest type</option>
            <option value="vip">VIP</option>
            <option value="vvip">VVIP</option>
            <option value="economy">Economy</option>
          </select>
          {formErrors.ticketType && (
            <p className="select-error-message">{formErrors.ticketType}</p>
          )}
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

        {formValues.questions?.length > 0 &&
          formValues.questions.map((question, index) => {
            return (
              <div className={`single-form-item`}>
                <label htmlFor={`question[${index}].label`}>{`Question - ${
                  index + 1
                }`}</label>
                <input
                  name={`question[${index}].label`}
                  type="text"
                  id={`question[${index}].label`}
                  placeholder="Write question"
                  onChange={(e) =>
                    handleQuestionLabelChange(e.target.value, index)
                  }
                  value={question.label}
                />
              </div>
            );
          })}

        <h4 className="add-a-question-button" onClick={addQuestionHandler}>
          + Add a Question
        </h4>
        <PrimaryButton
          disabled={isEventCreating || isEventUpdating}
          className={"form-submit-button"}
        >
          Confirm
        </PrimaryButton>
      </form>
    </CustomModal>
  );
};

export default NewTicketModal;
