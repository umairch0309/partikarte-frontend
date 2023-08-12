import React, { useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./SendTickets.scss";
import PrimaryButton from "../UI/PrimaryButton";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";
import validateForgotPasswordForm from "../../validation/ForgotPassword";

const initalState = {
  email: "",
};
const SendTickets = ({
  showSendTicketModal,
  setShowSendTicketModal,
  selectedRecord,
}) => {
  const [formData, setFormData] = useState(initalState);
  const [formErrors, setFormErrors] = useState({});

  // console.log(selectedRecord, "selectedRecord");
  console.log(formErrors);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateForgotPasswordForm, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateForgotPasswordForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // use api here
    //   after submitting form
    setShowSendTicketModal(false);
    setFormErrors({});
    setFormData(initalState);
  };

  return (
    <CustomModal
      onCancel={() => setShowSendTicketModal(false)}
      open={showSendTicketModal}
      onOk={() => setShowSendTicketModal(false)}
      title={"Send Ticket"}
      subtitle={"Enter the email to send tickets"}
      // width={700}
    >
      <form className="send-ticket-form-container" onSubmit={handleSubmit}>
        <div className={`form-item ${formErrors.email && "error"}`}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter email"
            onChange={handleInputChange}
            onBlur={handleOnBlur}
          />
          {formErrors.email && (
            <p className="error-message">{formErrors.email}</p>
          )}
        </div>

        <PrimaryButton type="submit">Submit</PrimaryButton>
      </form>
    </CustomModal>
  );
};

export default SendTickets;
