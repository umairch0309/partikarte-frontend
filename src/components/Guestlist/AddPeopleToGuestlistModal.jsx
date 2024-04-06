import React, { useEffect, useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./ModalForm.scss";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import PrimaryButton from "../UI/PrimaryButton";
import validateAddPeopleToGuest from "../../validation/AddPeopleToGuest";
import useHandleOnBlur from "../../hooks/useHandleOnBlur";
import { useQueryClient } from "@tanstack/react-query";
import { usePostApi } from "../../hooks/api-hooks/usePostApi";
import { usePutApi } from "../../hooks/api-hooks/usePutApi";
import {
  Button,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Select,
  Space,
} from "antd";
import { PhoneInput } from "react-international-phone";
const { Option } = Select;

const initialState = {
  name: "",
  surname: "",
  guestType: "",
  email: "",
  phoneNumber: "",
  notifyPeople: true,
};

const AddPeopleToGuestlistModal = ({
  showAddPeopleModal,
  setShowAddPeopleModal,
  setShowMultiplePeopleModal,
  selectedEvent,
  selectedGuest,
  setEditSelected,
  editSelected,
}) => {
  const isMobile = useIsMobileWidth();
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [newOption, setNewOption] = useState("");
  const [options, setOptions] = useState([
    {
      label: "Choose guest type",
      value: "",
    },
    {
      label: "VIP",
      value: "vip",
    },
    {
      label: "VVIP",
      value: "vvip",
    },
    {
      label: "Economy",
      value: "economy",
    },
  ]);

  useEffect(() => {
    if (selectedGuest?._id && editSelected) {
      setFormValues((prevState) => ({
        ...prevState,
        ...selectedGuest,
        notifyPeople: selectedGuest.isNotified,
      }));
    }
  }, [selectedGuest, editSelected]);

  const { handleMutation, isLoading: isCreating } = usePostApi();
  const { handleMutation: handleUpdate, isLoading: isUpdating } = usePutApi();

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
    formData.append("isNotified", formValues.notifyPeople);
    formData.append("eventId", selectedEvent?._id);

    setFormErrors({});
    if (selectedGuest?._id && editSelected) {
      handleUpdate(
        {
          path: `guests/${selectedGuest?._id}`,
          data: formData,
        },
        (res) => {
          queryClient.invalidateQueries(["get-all-guests", selectedEvent?._id]);
          setShowAddPeopleModal(false);
          setFormValues(initialState);
          setEditSelected(false);
        },
        (res) => {}
      );
    } else {
      handleMutation(
        {
          path: "guests/new-guest",
          data: formData,
        },
        (res) => {
          queryClient.invalidateQueries(["get-all-guests", selectedEvent?._id]);
          setShowAddPeopleModal(false);
          setFormValues(initialState);
          setEditSelected(false);
        },
        (res) => {}
      );
    }
  };

  return (
    <CustomModal
      onCancel={() => {
        setFormValues(initialState);
        setFormErrors({});
        setShowAddPeopleModal(false);
        setEditSelected(false);
      }}
      open={showAddPeopleModal}
      onOk={() => setShowAddPeopleModal(false)}
      title={"Add Guest"}
      subtitle={"Please enter the information to add guest to the list"}
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
          <ConfigProvider>
            <Select
              onChange={(v) =>
                handleInputChange({ target: { name: "guestType", value: v } })
              }
              name="guestType"
              id="guestType"
              value={formValues.guestType}
              style={{
                width: "100%",
                marginTop: "5px",
                ...(formErrors.guestType && {
                  border: "1px solid red",
                  borderRadius: "10px",
                }),
              }}
              options={options}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider
                    style={{
                      margin: "8px 0",
                    }}
                  />
                  <Space
                    style={{
                      padding: "0 8px 4px",
                    }}
                  >
                    <Input
                      style={{ width: "100%" }}
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Specify any other"
                    />
                    <Button
                      type="primary"
                      onClick={() => {
                        setOptions([
                          ...options,
                          { label: newOption, value: newOption },
                        ]);
                        setNewOption("");
                      }}
                    >
                      Add guest list type
                    </Button>
                  </Space>
                </>
              )}
            />
          </ConfigProvider>
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
            className={`single-form-item  ${
              formErrors.phoneNumber ? "error" : ""
            }`}
          >
            <label htmlFor="phoneNumber">Phone Number</label>
            <PhoneInput
              defaultCountry="usa"
              value={formValues.phoneNumber}
              className={`phone-input-whole ${
                formErrors.phoneNumber ? "phone-input-whole-error" : ""
              }`}
              inputClassName="phone-input"
              onChange={(e) =>
                handleInputChange({
                  target: { value: e, name: "phoneNumber" },
                })
              }
              onBlur={(e) =>
                handleOnBlur({
                  target: {
                    value: e,
                    name: "phoneNumber",
                  },
                })
              }
            />
            {formErrors.phoneNumber && (
              <p className="error-message">{formErrors.phoneNumber}</p>
            )}
          </div>
        </div>
        <div className="side-by-side-guest-input">
          {/* <div className="single-form-item radio-input-container">
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
          </div> */}
          <div className="side-by-side-guest-input-for-footer-buttons">
            <button
              onClick={() => {
                setShowAddPeopleModal(false);
                setShowMultiplePeopleModal(true);
              }}
              type="button"
              className="add-multiple-button"
            >
              Add multiple guests
            </button>

            <PrimaryButton disabled={isCreating || isUpdating}>
              Save
            </PrimaryButton>
          </div>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddPeopleToGuestlistModal;
