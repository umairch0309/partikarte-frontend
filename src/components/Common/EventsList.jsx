import React, { useEffect } from "react";
import "./EventsList.scss";
import { ReactSVG } from "react-svg";
import { Dropdown } from "antd";
import PrimaryButton from "../UI/PrimaryButton";
import { useState } from "react";
import { useRef } from "react";
import { useAllEvents } from "../../api/manage-events";
import { Skeleton } from "antd";

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

  const [eventsData, setEventsData] = useState([]);
  const { isLoading } = useAllEvents((res) => {
    setEventsData(res?.events);
  });

  useEffect(() => {
    if (!selectedEvent && eventsData?.length > 0) {
      setSelectedEvent(eventsData[0]);
    }
  }, [eventsData]);

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
        <>
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
          {showInputs && (
            <div className="header-right-mobile-search-button-container">
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
        </>
      )}
      <div className="event-list-container" ref={scrollContainerRef}>
        {isLoading ? (
          <Skeleton active={true} paragraph={{ rows: 5 }} size={"small"} />
        ) : eventsData && eventsData?.length > 0 ? (
          eventsData.map((event) => (
            <div
              onClick={() => setSelectedEvent(event)}
              className={`single-event-container ${
                selectedEvent?._id === event?._id ? "selected-event" : ""
              }`}
              key={event?._id}
            >
              <div className="event-header">
                <div className="date-container">
                  <ReactSVG src="/icons/tools/clock.svg" />
                  <span>{formatDate(event?.createdAt)}</span>
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
              <h3>{event?.eventName}</h3>
              <p className="ticket-time-date">
                Available from {formatDate(event?.eventStart)} to{" "}
                {formatDate(event?.eventEnd)}
              </p>
            </div>
          ))
        ) : (
          <p className="black">You haven't added any events for now.</p>
        )}
      </div>
    </div>
  );
};

export default EventsList;
