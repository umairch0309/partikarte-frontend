import React, { useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./OrderInvoice.scss";
import PrimaryButton from "../UI/PrimaryButton";
import { useOrderDetailsById } from "../../api/orders";

const OrderInvoice = ({
  showOrderInvoice,
  setShowOrderInvoice,
  selectedRecord,
}) => {
  const [order, setOrder] = useState(null);
  const [data, setData] = useState({
    amount: 0,
    amountWithVat: 0,
    VAT: 0,
    date: new Date()?.toLocaleString("en-US", {
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
    }),
  });

  const { isLoading } = useOrderDetailsById(selectedRecord?._id, (data) => {
    setOrder(data?.order);

    const orderData = data?.order;
    if (!orderData) return;

    let totalAmount = 0;
    let totalAmountWithVat = 0;

    orderData?.tickets?.forEach((el) => {
      const ticketData = orderData?.eventId?.tickets?.find(
        (t) => t?._id == el?.ticketId
      );
      if (!ticketData) return;
      totalAmount += parseFloat(ticketData?.price) * el?.noOfTickets || 0;
      totalAmountWithVat +=
        parseFloat(ticketData?.priceWithVAT) * el?.noOfTickets || 0;
    });

    setData({
      amount: totalAmount?.toFixed(2),
      amountWithVat: totalAmountWithVat?.toFixed(2),
      VAT: (totalAmountWithVat - totalAmount)?.toFixed(2),
      date: new Date(orderData?.createdAt)?.toLocaleString("en-US", {
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
      }),
    });
  });

  // console.log(selectedRecord)
  return (
    <CustomModal
      onCancel={() => setShowOrderInvoice(false)}
      open={showOrderInvoice}
      onOk={() => setShowOrderInvoice(false)}
      title={"Order Invoice"}
      subtitle={"Following are the details of the order invoice."}
      // width={700}
      loading={isLoading}
    >
      <div className="order-invoice-main-container">
        <div className="invoice-item">
          <h4>Order Amount (without VAT)</h4>
          <h3>$ {data?.amount}</h3>
        </div>
        <div className="invoice-item">
          <h4>Order Amount (with VAT)</h4>
          <h3>$ {data?.amountWithVat}</h3>
        </div>
        <div className="invoice-item">
          <h4>VAT Amount</h4>
          <h3>$ {data?.VAT}</h3>
        </div>
        <div className="invoice-item">
          <h4>Date/Time of Purcshase</h4>
          <h3>{data.date}</h3>
        </div>
      </div>
    </CustomModal>
  );
};

export default OrderInvoice;
