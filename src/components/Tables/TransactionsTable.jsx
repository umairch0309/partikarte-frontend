import { Table } from "antd";
import React, { useEffect, useState } from "react";
import formatDate from "../../utilities/formatDate";

const TransactionsTable = ({ transactionsData, loading }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(transactionsData || []);
  }, [transactionsData]);

  const columns = [
    {
      title: "TxnId",
      dataIndex: "txnId",
      key: "txnId",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Account No.",
      dataIndex: "accountNo",
      key: "accountNo",
    },
    {
      title: "Transferred To",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "Transfer date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatDate(text),
    },
  ];

  return (
    <Table
      scroll={{ scrollToFirstRowOnChange: true, x: window.innerWidth <= 768 }}
      columns={columns}
      dataSource={data}
      loading={loading}
    />
  );
};

export default TransactionsTable;
