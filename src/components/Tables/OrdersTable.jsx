import { Table } from "antd";
import React, { useEffect, useState } from "react";

const OrdersTable = ({ ordersData }) => {
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
    },
    {
      title: "Event name",
      dataIndex: "eventName",
      key: "eventName",
    },
    {
      title: "Ticket type",
      dataIndex: "ticketType",
      key: "ticketType",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (text, record) => {
        return `$${text}`;
      },
    },
    {
      title: "Purchase date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      align: "center",
    },
  ];

  return (
    <Table
      scroll={{ scrollToFirstRowOnChange: true, x: window.innerWidth <= 768 }}
      columns={columns}
      dataSource={data}
    />
  );
};

export default OrdersTable;
