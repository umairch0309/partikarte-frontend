import { Dropdown, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import formatDate from "../../utilities/formatDate";
import { useDeleteApi } from "../../hooks/api-hooks/useDeleteApi";
import usePermissionCheck from "../../hooks/usePermissionCheck";
import { useQueryClient } from "@tanstack/react-query";

const TicketsTable = ({
  ticketsData,
  isLoading = false,
  setTicketEditStatus,
  setSelectedTicket,
  setShowNewTicketModal,
  selectedTicket,
  selectedEvent,
}) => {
  const { checkPermission } = usePermissionCheck();
  const queryClient = useQueryClient();
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(ticketsData || []);
  }, [ticketsData]);

  const { isDeleting, handleMutation } = useDeleteApi();
  const handleDelete = () => {
    if (selectedTicket?.ticketOrders > 0) {
      message.warning(
        "Selected tickets has sold tickets. Refund tickets to delete."
      );
      return;
    }

    handleMutation(
      {
        path: `event/${selectedEvent?._id}/tickets/${selectedTicket?._id}`,
      },
      (res) => {
        queryClient.invalidateQueries({ queryKey: ["get-all-events"] });
        queryClient.invalidateQueries({
          queryKey: ["get-all-tickets", selectedEvent?._id],
        });
      }
    );
  };

  const items = [
    {
      label: checkPermission("updateTicket").status && (
        <div
          onClick={() => {
            setTicketEditStatus(true);
            setShowNewTicketModal(true);
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
      label: checkPermission("deleteTicket").status && (
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
              <button
                onClick={() => setSelectedTicket(record)}
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
      rowKey={(record) => record._id || record.ticketName}
      loading={isLoading}
      scroll={{ scrollToFirstRowOnChange: true, x: window.innerWidth <= 768 }}
      columns={columns}
      dataSource={data}
    />
  );
};

export default TicketsTable;
