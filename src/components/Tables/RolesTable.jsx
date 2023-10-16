import { Dropdown, Table } from "antd";
import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import formatDate from "../../utilities/formatDate";

const RolesTable = ({
  rolesData,
  loading,
  setSelectedRole,
  setRoleEditStatus,
  setShowNewRoleModal,
  setRoleViewStatus,
  onDeleteRole,
}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(rolesData || []);
  }, [rolesData]);

  const items = [
    {
      label: (
        <div
          onClick={() => {
            setRoleViewStatus(true);
            setShowNewRoleModal(true);
          }}
          className="button-in-dropdown"
        >
          <ReactSVG src="/icons/tools/eye.svg" />
          <span>View</span>
        </div>
      ),
      key: "0",
      className: "royal-blue-button-dropdown",
    },
    {
      label: (
        <div
          className="button-in-dropdown"
          onClick={() => {
            setShowNewRoleModal(true);
            setRoleEditStatus(true);
          }}
        >
          <ReactSVG className="button-svg" src="/icons/tools/edit.svg" />
          <span>Edit</span>
        </div>
      ),
      key: "1",
      className: "blue-button-dropdown",
    },
    {
      label: (
        <div
          onClick={() => {
            onDeleteRole();
          }}
          className="button-in-dropdown"
        >
          <ReactSVG className="button-svg" src="/icons/tools/delete.svg" />
          <span>Delete</span>
        </div>
      ),
      key: "2",
      className: "red-button-dropdown",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 490,
    },
    {
      title: "Created on",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatDate(text),
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
              placement="left"
              className="dropdown-table-actions"
            >
              <button
                onClick={() => {
                  setSelectedRole(record);
                }}
                className="dots-action-button"
              >
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
      loading={loading}
    />
  );
};

export default RolesTable;
