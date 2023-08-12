import React, { useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./OrderInvoice.scss";
import PrimaryButton from "../UI/PrimaryButton";

const OrderInvoice = ({
  showOrderInvoice,
  setShowOrderInvoice,
  selectedRecord,
}) => {
  // console.log(selectedRecord)
  return (
    <CustomModal
      onCancel={() => setShowOrderInvoice(false)}
      open={showOrderInvoice}
      onOk={() => setShowOrderInvoice(false)}
      title={"Order Invoice"}
      subtitle={"Following are the details of the order invoice."}
      // width={700}
    >
      <div className="order-invoice-main-container">
        <div className="invoice-item">
          <h4>Order Amount (without VAT)</h4>
          <h3>$ 26.98</h3>
        </div>
        <div className="invoice-item">
          <h4>Order Amount (with VAT)</h4>
          <h3>$ 26.98</h3>
        </div>
        <div className="invoice-item">
          <h4>VAT Amount</h4>
          <h3>$ 26.98</h3>
        </div>
        <div className="invoice-item">
          <h4>Date/Time of Purcshase</h4>
          <h3>$ 26.98</h3>
        </div>
      </div>
    </CustomModal>
  );
};

export default OrderInvoice;
