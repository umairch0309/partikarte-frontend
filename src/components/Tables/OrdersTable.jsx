import { Table } from "antd";
import React, { useEffect, useState } from "react";
import formatDate from "../../utilities/formatDate";

const OrdersTable = ({ ordersData, isLoading }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(ordersData || []);
  }, [ordersData]);

  const columns = [
    {
      title: "Order Id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Customer name",
      dataIndex: "customerName",
      key: "customerName",
      render: (text) => <span className="white-space-nowrap">{text}</span>,
    },
    {
      title: "Event name",
      dataIndex: "eventName",
      key: "eventName",
      render: (text, record) => (
        <span className="white-space-nowrap" title={record?.eventId?.eventName}>
          {record?.eventId?.eventName?.slice(0, 25) +
            (record?.eventId?.eventName?.length > 25 ? "..." : "")}
        </span>
      ),
    },
    {
      title: "Ticket type",
      dataIndex: "ticketType",
      key: "ticketType",
      align: "center",
      render: (text, record) => (
        <span>
          {record?.tickets
            ?.map((selectedTicket) =>
              record?.eventId?.tickets?.find(
                (ticket) => ticket._id === selectedTicket.ticketId
              )
            )
            .filter(Boolean)
            .map((matchingTicket) => matchingTicket?.ticketType)
            .join(", ")
            ?.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Price",
      dataIndex: "orderAmount",
      key: "orderAmount",
      align: "center",
      sorter: (a, b) => a.orderAmount - b.orderAmount,

      render: (text, record) => {
        return `$${text}`;
      },
    },
    {
      title: "Purchase date",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      sorter: (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      render: (text) => (
        <span className="white-space-nowrap">{formatDate(text)}</span>
      ),
    },
  ];

  return (
    <Table
      scroll={{ scrollToFirstRowOnChange: true, x: window.innerWidth <= 768 }}
      columns={columns}
      dataSource={data}
      loading={isLoading}
    />
  );
};

export default OrdersTable;
