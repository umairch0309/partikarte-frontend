import React, { useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./ModalForm.scss";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import PrimaryButton from "../UI/PrimaryButton";
import { CSVLink } from "react-csv";
import CSVReader from "react-csv-reader";
import { usePostApi } from "../../hooks/api-hooks/usePostApi";
import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

const AddMultiplePeopleToGuestlistModal = ({
  setShowAddPeopleModal,
  setShowMultiplePeopleModal,
  showMultiplePeopleModal,
  selectedEvent,
}) => {
  const isMobile = useIsMobileWidth();
  const [guests, setGuests] = useState([]);
  const { handleMutation, isLoading: isCreating } = usePostApi();
  const queryClient = useQueryClient();

  const headers = [
    { label: "Name", key: "name" },
    { label: "Surname", key: "surname" },
    { label: "Guest Type", key: "guestType" },
    { label: "Email", key: "email" },
    { label: "Phone Number", key: "phoneNumber" },
  ];
  const data = [{}];

  const handleFileUpload = (data) => {
    if (data && data.length > 0) {
      const uploadedHeaders = Object.keys(data[0]);

      const isValidHeaders =
        headers.every((expectedHeader) =>
          uploadedHeaders.includes(expectedHeader.key)
        ) &&
        uploadedHeaders.every((uploadedHeader) =>
          headers.some(
            (expectedHeader) => expectedHeader.key === uploadedHeader
          )
        );

      if (isValidHeaders) {
        const invalidEmails = [];

        // Check for valid email addresses
        const guestsWithValidEmails = data.filter((guest, index) => {
          const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email);
          if (!isValidEmail) {
            invalidEmails.push(index + 1);
          }
          return isValidEmail;
        });

        setGuests(guestsWithValidEmails);
        console.log("Uploaded Guests:", guestsWithValidEmails);

        if (invalidEmails.length > 0) {
          message.warning(
            `Invalid email addresses in records: ${invalidEmails.join(", ")}`
          );
          return;
        }

        onSaveHandler(guestsWithValidEmails);
      } else {
        message.error(
          "Please upload a valid file with valid data and headers."
        );
        console.error("Invalid headers in the uploaded file.");
      }
    }
  };

  const onSaveHandler = (guests) => {
    if (guests?.length > 0) {
      handleMutation(
        {
          path: "guests/multiple-new-guests",
          data: { guests, eventId: selectedEvent?._id },
        },
        (res) => {
          queryClient.invalidateQueries(["get-all-guests", selectedEvent?._id]);
          setShowMultiplePeopleModal(false);
          setShowAddPeopleModal(false);
        },
        (res) => {}
      );
    } else {
      message.error("Please upload a valid file with valid data.");
    }
  };

  return (
    <CustomModal
      onCancel={() => {
        setShowMultiplePeopleModal(false);
      }}
      open={showMultiplePeopleModal}
      onOk={() => setShowMultiplePeopleModal(false)}
      title={"Add Multiple Guests"}
      subtitle={
        "Please add Guest Name & Surname and press enter to make it as new line to same guest."
      }
      width={!isMobile && 700}
    >
      <form className="add-guest-form-container">
        <div>
          Please download the template file and fill it with your guests
          accordingly. To download the template file, please click the button
          below.
        </div>
        <div className="side-by-side-guest-input">
          <CSVLink
            data={data}
            headers={headers}
            filename={"guest_template.csv"}
            className="add-multiple-button"
          >
            Download Template
          </CSVLink>
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
          <label className="upload-all-guests-file" htmlFor="uploadGuests">
            Upload Guests Sheet
          </label>
          <CSVReader
            inputId="uploadGuests"
            onFileLoaded={handleFileUpload}
            parserOptions={{
              header: true,
              dynamicTyping: true,
              skipEmptyLines: true,
              transformHeader: (header) => {
                const words = header.toLowerCase().split(/\W+/);
                const camelCaseHeader = words.reduce((result, word, index) => {
                  return index === 0
                    ? word
                    : result + word.charAt(0).toUpperCase() + word.slice(1);
                }, "");
                return camelCaseHeader;
              },
            }}
            inputStyle={{ display: "none" }}
          />
        </div>
      </form>
    </CustomModal>
  );
};

export default AddMultiplePeopleToGuestlistModal;
