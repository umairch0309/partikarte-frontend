import React from "react";
import "./EventsList.scss";
import { ReactSVG } from "react-svg";
import { Dropdown } from "antd";

const EventsList = () => {
  const items = [
    {
      label: "action 1",
      key: "0",
    },
    {
      label: "action 2",
      key: "1",
    },
  ];
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    return `${date.getDate().toString().padStart(2, "0")}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${date.getFullYear()} • ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const eventsData = [
    {
      date: "2023-02-21T00:00:00.000Z",
      eventName: "Introduction Basic Programming HTML & CSS",
      startTime: "2023-07-13T20:00:00.000Z",
      endTime: "2023-07-13T23:30:00.000Z",
    },
    {
      date: "2023-02-21T00:00:00.000Z",
      eventName: "Introduction Basic Programming HTML & CSS",
      startTime: "2023-07-13T20:00:00.000Z",
      endTime: "2023-07-13T23:30:00.000Z",
    },
    {
      date: "2023-02-21T00:00:00.000Z",
      eventName: "Introduction Basic Programming HTML & CSS",
      startTime: "2023-07-13T20:00:00.000Z",
      endTime: "2023-07-13T23:30:00.000Z",
    },
    {
      date: "2023-02-21T00:00:00.000Z",
      eventName: "Introduction Basic Programming HTML & CSS",
      startTime: "2023-07-13T20:00:00.000Z",
      endTime: "2023-07-13T23:30:00.000Z",
    },
    {
      date: "2023-02-21T00:00:00.000Z",
      eventName: "Introduction Basic Programming HTML & CSS",
      startTime: "2023-07-13T20:00:00.000Z",
      endTime: "2023-07-13T23:30:00.000Z",
    },
    {
      date: "2023-02-21T00:00:00.000Z",
      eventName: "Introduction Basic Programming HTML & CSS",
      startTime: "2023-07-13T20:00:00.000Z",
      endTime: "2023-07-13T23:30:00.000Z",
    },
    {
      date: "2023-02-21T00:00:00.000Z",
      eventName: "Introduction Basic Programming HTML & CSS",
      startTime: "2023-07-13T20:00:00.000Z",
      endTime: "2023-07-13T23:30:00.000Z",
    },
  ];

  return (
    <div className="event-list-container">
      {eventsData.map((event, index) => (
        <div className="single-event-container" key={index}>
          <div className="event-header">
            <div className="date-container">
              <ReactSVG src="/icons/tools/clock.svg" />
              <span>{formatDate(event.date)}</span>
            </div>
            <Dropdown
              menu={{
                items: items,
              }}
              placement="bottom"
              trigger={["click"]}
            >
              <ReactSVG src="/icons/tools/dots-action.svg" />
            </Dropdown>
          </div>
          <h3>{event.eventName}</h3>
          <p className="ticket-time-date">
            Available from {formatDate(event.startTime)} to{" "}
            {formatDate(event.endTime)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
