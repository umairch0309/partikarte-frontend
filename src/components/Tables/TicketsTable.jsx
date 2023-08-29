import { Dropdown, Table } from "antd";
import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import formatDate from "../../utilities/formatDate";

const TicketsTable = ({ ticketsData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(ticketsData || []);
  }, [ticketsData]);

  const items = [
    {
      label: (
        <div className="button-in-dropdown">
          <ReactSVG src="/icons/tools/edit.svg" />
          <span>Edit</span>
        </div>
      ),
      key: "0",
      className: "blue-button-dropdown",
    },
    {
      label: (
        <div className="button-in-dropdown">
          <ReactSVG className="button-svg" src="/icons/tools/delete.svg" />
          <span>Delete</span>
        </div>
      ),
      key: "1",
      className: "red-button-dropdown",
    },
  ];

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: "Ticket Name",
      dataIndex: "ticketName",
      key: "ticketName",
    },
    {
      title: "Ticket Type",
      dataIndex: "ticketType",
      align: "center",
      key: "ticketType",
      render: (text) => text?.toUpperCase(),
    },

    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
      render: (text, record) => (
        <span className="white-space-nowrap">
          {formatDate(record?.validFrom)} to {formatDate(record?.validTo)}
        </span>
      ),
    },
    {
      title: "Tickets Ordered",
      dataIndex: "ticketOrders",
      key: "ticketOrders",
      align: "center",
    },
    {
      title: "Remaining Tickets",
      dataIndex: "remainingCapacity",
      key: "remainingCapacity",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      align: "center",
      render: (text) => "$" + text,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      align: "center",
      render: (text, record) => {
        return (
          <div className="table-actions-container">
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
              placement="bottom"
              className="dropdown-table-actions"
            >
              <button className="dots-action-button">
                <ReactSVG
                  className="dots-action-svg"
                  src="/icons/tools/dots-action.svg"
                />
              </button>
            </Dropdown>
          </div>
        );
      },
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

export default TicketsTable;
