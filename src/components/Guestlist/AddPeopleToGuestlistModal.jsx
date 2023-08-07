import React from "react";
import CustomModal from "../UI/CustomModal";
import "./AddPeopleToGuestlistModal.scss";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import PrimaryButton from "../UI/PrimaryButton";

const AddPeopleToGuestlistModal = ({
  showAddPeopleModal,
  setShowAddPeopleModal,
}) => {
  const isMobile = useIsMobileWidth();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <CustomModal
      onCancel={() => setShowAddPeopleModal(false)}
      open={showAddPeopleModal}
      onOk={() => setShowAddPeopleModal(false)}
      title={"Add Guest"}
      subtitle={"Please enter the information to add guest in list."}
      width={!isMobile && 700}
    >
      <form className="add-guest-form-container" onSubmit={handleSubmit}>
        <div className="side-by-side-guest-input">
          <div className="single-form-item">
            <label htmlFor="name">Name*</label>
            <input
              name="name"
              type="text"
              id="name"
              placeholder="Name"
              required
            />
          </div>
          <div className="single-form-item">
            <label htmlFor="surname">Surname*</label>
            <input
              name="surname"
              type="text"
              id="surname"
              placeholder="Surname"
              required
            />
          </div>
        </div>
        <div className="single-form-item">
          <label htmlFor="guestType">Guest Type*</label>
          <select name="guestType" id="guestType" required>
            <option value="vip">VIP</option>
            <option value="vvip">VVIP</option>
            <option value="economy">Economy</option>
          </select>
        </div>
        <div className="side-by-side-guest-input">
          <div className="single-form-item">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              id="email"
              placeholder="Email address"
              required
            />
          </div>
          <div className="single-form-item">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              name="phoneNumber"
              type="text"
              id="phoneNumber"
              placeholder="Phone number"
              required
            />
          </div>
        </div>
        <div className="side-by-side-guest-input">
          <div className="single-form-item radio-input-container">
            <input
              className="radio-input"
              name="notifyPeople"
              type="radio"
              id="notifyPeople"
            />
            <label htmlFor="notifyPeople">Notify people</label>
          </div>
          <div className="side-by-side-guest-input">
            <button className="add-multiple-button">Add multiple guests</button>
            <PrimaryButton>Confirm</PrimaryButton>
          </div>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddPeopleToGuestlistModal;
