import { Dropdown, Table } from "antd";
import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";

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
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Ticket Name",
      dataIndex: "ticketName",
      key: "ticketName",
    },
    {
      title: "Ticket Type",
      dataIndex: "ticketType",
      key: "ticketType",
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
    },
    {
      title: "Tickets Ordered",
      dataIndex: "numberOfTicketsOrdered",
      key: "numberOfTicketsOrdered",
      align: "center",
    },
    {
      title: "Remaining Tickets",
      dataIndex: "remainingTickets",
      key: "remainingTickets",
    },
    {
      title: "Revenue",
      dataIndex: "revenueGenerated",
      key: "revenueGenerated",
      align: "center",
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
