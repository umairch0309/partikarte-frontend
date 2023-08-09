import { Table } from "antd";
import React, { useEffect, useState } from "react";

const TopReferrersTable = ({ referrersData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(referrersData || []);
  }, [referrersData]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Revenue Generated",
      dataIndex: "revenueGenerated",
      key: "revenueGenerated",
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

export default TopReferrersTable;
