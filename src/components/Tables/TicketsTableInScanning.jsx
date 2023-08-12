import { Table } from "antd";
import React, { useEffect, useState } from "react";

const TicketsTableInScanning = ({ ticketsData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(ticketsData || []);
  }, [ticketsData]);

  const columns = [
    {
      title: "Type of tickets",
      dataIndex: "ticketType",
      key: "ticketType",
    },
    {
      title: "Qty. Sold",
      dataIndex: "soldQuantity",
      key: "soldQuantity",
    },
    {
      title: "Qty. Admited",
      dataIndex: "admitedQuantity",
      key: "admitedQuantity",
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
