import React from "react";
import "./EventsList.scss";
import { ReactSVG } from "react-svg";
import { Dropdown } from "antd";
import PrimaryButton from "../UI/PrimaryButton";
import { useState } from "react";
import { useRef } from "react";

const EventsList = ({
  showHeader,
  showInputs,
  setShowAddNewEventModal,
  setSelectedEvent,
  selectedEvent,
}) => {
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

  const scrollContainerRef = useRef(null);

  const handleScroll = (scrollOffset) => {
    const scrollContainer = scrollContainerRef.current;
    scrollContainer.scrollTo({
      left:
        scrollContainer.scrollLeft +
        scrollOffset +
        (scrollOffset > 0 ? 20 : -20),
      behavior: "smooth",
    });
  };

  return (
    <div className="event-list-main-container">
      {showHeader && (
        <div className="event-list-header">
          <div className="event-list-header-left">
            <h3>Latest Events</h3>
          </div>
          <div className="event-list-header-right">
            {showInputs && (
              <div className="header-right-search-button-container">
                <div className="search-container">
                  <ReactSVG src="/icons/tools/search.svg" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Search events..."
                  />
                </div>
                <PrimaryButton
                  onClick={() => setShowAddNewEventModal(true)}
                  className={"add-new-event"}
                >
                  <ReactSVG src="/icons/tools/add-event.svg" />
                  <span>Add new Event</span>
                </PrimaryButton>
              </div>
            )}
            <div className="header-right-arrows">
              <ReactSVG
                onClick={() => handleScroll(-320)}
                className="featured-header-arrow arrow-left"
                src="/icons/tools/arrow-head-left.svg"
              />
              <ReactSVG
                onClick={() => handleScroll(320)}
                className="featured-header-arrow arrow-right"
                src="/icons/tools/arrow-head-right.svg"
              />
            </div>
          </div>
        </div>
      )}
      <div className="event-list-container" ref={scrollContainerRef}>
        {eventsData.map((event, index) => (
          <div
            onClick={() => setSelectedEvent({ ...event, index })}
            className={`single-event-container ${
              selectedEvent?.index === index ? "selected-event" : ""
            }`}
            key={index}
          >
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
    </div>
  );
};

export default EventsList;
