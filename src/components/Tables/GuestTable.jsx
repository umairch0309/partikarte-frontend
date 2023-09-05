import { Dropdown, Table } from "antd";
import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import formatDate from "../../utilities/formatDate";
import { useDeleteApi } from "../../hooks/api-hooks/useDeleteApi";

const GuestTable = ({
  guestsData,
  isLoading,
  setSelectedGuest,
  setShowAddPeopleModal,
  setEditSelected,
  selectedGuest,
}) => {
  const [data, setData] = useState([]);

  const { isDeleting, handleMutation } = useDeleteApi();

  const handleDelete = () => {
    handleMutation(
      {
        path: `guests/${selectedGuest?._id}`,
      },
      (res) => {
        queryClient.invalidateQueries(["get-all-guests", selectedEvent?._id]);
      }
    );
  };

  useEffect(() => {
    setData(guestsData || []);
  }, [guestsData]);

  const items = [
    {
      label: (
        <div
          onClick={() => {
            setShowAddPeopleModal(true);
            setEditSelected(true);
          }}
          className="button-in-dropdown"
        >
          <ReactSVG src="/icons/tools/edit.svg" />
          <span>Edit</span>
        </div>
      ),
      key: "0",
      className: "blue-button-dropdown",
    },
    {
      label: (
        <div onClick={handleDelete} className="button-in-dropdown">
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
      render: (text, record) => (
        <span className="white-space-nowrap">{text}</span>
      ),
    },
    {
      title: "Surnname",
      dataIndex: "surname",
      key: "surname",
      render: (text, record) => (
        <span className="white-space-nowrap">{text}</span>
      ),
    },
    {
      title: "Guest type",
      dataIndex: "guestType",
      key: "guestType",
      align: "center",
      render: (text, record) => text?.toUpperCase(),
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
      render: (text, record) => (record?.isNotified ? "Yes" : "No"),
    },
    {
      title: "Date added",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      render: (text, record) => formatDate(text),
    },
    {
      title: "Added by",
      dataIndex: "addedBy",
      key: "addedBy",
      render: (text, record) => record?.addedBy?.role?.toUpperCase(),
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
              <button
                onClick={() => setSelectedGuest(record)}
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
      loading={isLoading}
    />
  );
};

export default GuestTable;
