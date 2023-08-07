import { Dropdown, Table } from "antd";
import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";

const GuestTable = ({ guestsData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(guestsData || []);
  }, [guestsData]);

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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Surnname",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Guest type",
      dataIndex: "guestType",
      key: "guestType",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Notified",
      dataIndex: "notified",
      key: "notified",
      align: "center",
      render: (text, record) => (text == true ? "Yes, " : "No"),
    },
    {
      title: "Date added",
      dataIndex: "dateAdded",
      key: "dateAdded",
      align: "center",
    },
    {
      title: "Added by",
      dataIndex: "addedBy",
      key: "addedBy",
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

export default GuestTable;
