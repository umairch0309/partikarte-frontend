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
    },
    {
      title: "No. of Guest",
      dataIndex: "guestNumber",
      key: "guestNumber",
    },
    {
      title: "Guest Admited",
      dataIndex: "admittedGuest",
      key: "admittedGuest",
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
