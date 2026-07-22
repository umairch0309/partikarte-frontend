import { Dropdown, Table } from "antd";
import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import RefundOrderAlert from "../Orders/RefundOrderAlert";
import SendTickets from "../Orders/SendTickets";
import OrderInvoice from "../Orders/OrderInvoice";
import formatDate from "../../utilities/formatDate";
import currencySymbolGenerator from "../../utilities/currencySymbolGenerator";

const CustomersTable = ({ customersData, isLoading }) => {
  const [data, setData] = useState([]);
  const [showRefundAlert, setShowRefundAlert] = useState(false);
  const [showSendTicketModal, setShowSendTicketModal] = useState(false);
  const [showOrderInvoice, setShowOrderInvoice] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    setData(customersData || []);
  }, [customersData]);

  const items = [
    {
      label: (
        <div
          onClick={() => setShowOrderInvoice(true)}
          className="button-in-dropdown"
        >
          <ReactSVG src="/icons/tools/view-invoice.svg" />
          <span>View Invoice</span>
        </div>
      ),
      key: "0",
      className: "royal-blue-button-dropdown",
    },
    {
      label: (
        <div className="button-in-dropdown">
          <ReactSVG className="button-svg" src="/icons/tools/view-order.svg" />
          <span>View Order</span>
        </div>
      ),
      key: "1",
      className: "blue-button-dropdown",
    },
    {
      label: (
        <div
          onClick={() => setShowRefundAlert(true)}
          className="button-in-dropdown"
        >
          <ReactSVG className="button-svg" src="/icons/tools/refund.svg" />
          <span>Refund</span>
        </div>
      ),
      key: "2",
      className: "red-button-dropdown",
    },
    {
      label: (
        <div
          onClick={() => setShowSendTicketModal(true)}
          className="button-in-dropdown"
        >
          <ReactSVG
            className="button-svg"
            src="/icons/tools/cancel-ticket.svg"
          />
          <span>Resend/Cancel Tickets</span>
        </div>
      ),
      key: "3",
      className: "purple-button-dropdown",
    },
  ];

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: "Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "Order Amount",
      dataIndex: "orderAmount",
      key: "orderAmount",
      align: "center",
      render: (text, record) => {
        const currency =
          record?.currency ||
          record?.eventId?.eventCurrency ||
          "EUR";
        return `${currencySymbolGenerator(currency)}${Number(text || 0).toFixed(2)}`;
      },
    },
    {
      title: "Date/Time",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      render: (text) => formatDate(text),
    },
    {
      title: "No. of Tickets",
      dataIndex: "noOfTickets",
      key: "noOfTickets",
      align: "center",
    },
    {
      title: "Newsletter Subscription",
      dataIndex: "newsLetterSubscription",
      key: "newsLetterSubscription",
      align: "center",
      render: (text, record) => (record.recommendations ? "Yes" : "No"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      align: "center",
      render: (text, record) => {
        return (
          <div className="table-actions-container">
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
              placement="bottomLeft"
              className="dropdown-table-actions"
            >
              <button
                onClick={() => setSelectedRecord(record)}
                className="dots-action-button"
              >
                <ReactSVG
                  className="dots-action-svg"
                  src="/icons/tools/dots-action.svg"
                />
              </button>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Table
        scroll={{ scrollToFirstRowOnChange: true, x: window.innerWidth <= 768 }}
        columns={columns}
        dataSource={data}
        loading={isLoading}
      />
      <RefundOrderAlert
        showRefundAlert={showRefundAlert}
        setShowRefundAlert={setShowRefundAlert}
        selectedRecord={selectedRecord}
      />
      <SendTickets
        showSendTicketModal={showSendTicketModal}
        setShowSendTicketModal={setShowSendTicketModal}
        selectedRecord={selectedRecord}
      />
      <OrderInvoice
        showOrderInvoice={showOrderInvoice}
        setShowOrderInvoice={setShowOrderInvoice}
        selectedRecord={selectedRecord}
      />
    </>
  );
};

export default CustomersTable;
