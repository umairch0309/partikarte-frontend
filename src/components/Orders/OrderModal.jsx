import React, { useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./OrderModal.scss";

const OrderModal = ({ showOrderModal, setShowOrderModal, selectedRecord }) => {
  // console.log(selectedRecord)
  return (
    <CustomModal
      onCancel={() => setShowOrderModal(false)}
      open={showOrderModal}
      onOk={() => setShowOrderModal(false)}
      title={"Order Details"}
      subtitle={"Following are the details of the order."}
      // width={700}
    >
      <div className="order-modal-main-container">
        <div className="details-item">
          <h4>Customer Name</h4>
          <h3>{selectedRecord?.customerName}</h3>
        </div>
        <div className="details-item">
          <h4>Customer Email</h4>
          <h3>{selectedRecord?.customerEmail}</h3>
        </div>
        <div className="details-item">
          <h4>Customer Phone Number</h4>
          <h3>{selectedRecord?.customerPhoneNumber}</h3>
        </div>
        <div className="details-item">
          <h4>Customer Address</h4>
          <h3>{selectedRecord?.customerAddress?.addressDescription}</h3>
        </div>
        <div className="details-item">
          <h4>Order Amount</h4>
          <h3>{selectedRecord?.orderAmount}</h3>
        </div>
        <div className="details-item">
          <h4>Payment Status</h4>
          <h3
            style={{ width: "fit-content" }}
            className={selectedRecord?.paymentStatus ? "green" : "red"}
          >
            {selectedRecord?.paymentStatus ? "Paid" : "Unpaid"}
          </h3>
        </div>

        <div className="details-item">
          <h4>Company Name</h4>
          <h3>{selectedRecord?.businessId?.company?.companyName}</h3>
        </div>

        <div className="details-item">
          <h4>Company Reg. No.</h4>
          <h3>{selectedRecord?.businessId?.company?.companyRegistryNumber}</h3>
        </div>
      </div>
    </CustomModal>
  );
};

export default OrderModal;
