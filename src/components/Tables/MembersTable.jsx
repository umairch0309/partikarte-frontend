import { Dropdown, Table } from "antd";
import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import DeleteAlert from "../UserManagement/DeleteAlert";

const MemebersTable = ({ membersData, isLoading }) => {
  const [data, setData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    setData(membersData || []);
  }, [membersData]);

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
        <div
          onClick={() => setShowDeleteAlert(true)}
          className="button-in-dropdown"
        >
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="white-space-nowrap">{text}</span>,
    },
    {
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
      render: (text) => <span className="white-space-nowrap">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      align: "center",
      render: (text) => new Date(text)?.toLocaleDateString(),
    },
    {
      title: "Member Type",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "100",
      render: (text) =>
        text?.addressDescription + " " + text?.city + " " + text?.country,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      align: "center",
      render: (text, record) => {
        return (
          <div
            onClick={() => setSelectedRecord(record)}
            className="table-actions-container"
          >
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
              placement="bottomLeft"
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
    <>
      <Table
        scroll={{ scrollToFirstRowOnChange: true, x: window.innerWidth <= 768 }}
        columns={columns}
        dataSource={data}
        loading={isLoading}
      />
      <DeleteAlert
        selectedRecord={selectedRecord}
        showDeleteAlert={showDeleteAlert}
        setShowDeleteAlert={setShowDeleteAlert}
      />
    </>
  );
};

export default MemebersTable;
