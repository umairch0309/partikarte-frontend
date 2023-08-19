import { Dropdown, Table } from "antd";
import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import DeleteAlert from "../UserManagement/DeleteAlert";

const MemebersTable = ({ membersData }) => {
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
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Date of Birth",
      dataIndex: "datOfBirth",
      key: "datOfBirth",
      align: "center",
    },
    {
      title: "Member Type",
      dataIndex: "memberType",
      key: "memberType",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "100",
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
