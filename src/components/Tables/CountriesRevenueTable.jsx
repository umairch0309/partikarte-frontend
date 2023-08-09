import { Table } from "antd";
import React, { useEffect, useState } from "react";

const CountriesRevenueTable = ({ countriesData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(countriesData || []);
  }, [countriesData]);

  const columns = [
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
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

export default CountriesRevenueTable;
