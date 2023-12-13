import { Table } from "antd";
import React, { useEffect, useState } from "react";

const GuestsTableInScanning = ({ guestsData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(guestsData || []);
  }, [guestsData]);

  const columns = [
    {
      title: "Guest type",
      dataIndex: "guestType",
      key: "guestType",
      render: (text) => (
        <span style={{ textTransform: "uppercase" }}>{text}</span>
      ),
    },
    {
      title: "No. of Guest",
      dataIndex: "totalGuests",
      key: "totalGuests",
    },
    {
      title: "Guest Admited",
      dataIndex: "totalPresentGuests",
      key: "totalPresentGuests",
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

export default GuestsTableInScanning;
