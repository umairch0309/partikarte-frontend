import { Table } from "antd";
import React, { useEffect, useState } from "react";

const EventAnalyticsTable = ({ analyticsData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(analyticsData || []);
  }, [analyticsData]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Values",
      dataIndex: "values",
      key: "values",
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

export default EventAnalyticsTable;
