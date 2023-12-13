import { Table } from "antd";
import React, { useEffect, useState } from "react";

const TicketsTableInScanning = ({ ticketsData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(ticketsData || []);
  }, [ticketsData]);

  const columns = [
    {
      title: "Ticket Name",
      dataIndex: "ticketName",
      key: "ticketName",
    },
    {
      title: "Type of tickets",
      dataIndex: "ticketType",
      key: "ticketType",
      render: (text) => (
        <span style={{ textTransform: "uppercase" }}>{text}</span>
      ),
    },
    {
      title: "Qty. Sold",
      dataIndex: "ticketOrders",
      key: "ticketOrders",
    },
    {
      title: "Qty. Remaining",
      dataIndex: "remainingCapacity",
      key: "remainingCapacity",
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

export default TicketsTableInScanning;
