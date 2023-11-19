import React, { useEffect, useState } from "react";
import EventCard from "../Common/EventCard";
import PrimaryButton from "../UI/PrimaryButton";
import "./AllEvents.scss";
import { useNavigate } from "react-router-dom";
import { useAllEventsForCustomer } from "../../api/manage-events";
import { Skeleton } from "antd";

const AllEvents = ({ link, searchText, interval }) => {
  const [eventsCount, setEventsCount] = useState(6);
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const navigate = useNavigate();
  const { isLoading } = useAllEventsForCustomer((res) => {
    setAllEvents(res?.events);
  });

  useEffect(() => {
    const filtered = allEvents.filter((event) => {
      const isMatch =
        event.eventName?.toLowerCase().includes(searchText?.toLowerCase()) ||
        event.eventDescription
          ?.toLowerCase()
          .includes(searchText?.toLowerCase());

      // Filter based on interval
      if (interval === "All") {
        return isMatch;
      } else if (interval === "Today") {
        const today = new Date();
        return (
          isMatch &&
          today >= new Date(event.eventStart) &&
          today <= new Date(event.eventEnd)
        );
      } else if (interval === "Tomorrow") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return (
          isMatch &&
          tomorrow >= new Date(event.eventStart) &&
          tomorrow <= new Date(event.eventEnd)
        );
      } else if (interval === "Weekend") {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysUntilWeekend = 6 - dayOfWeek; // 6 represents Saturday
        const weekendStart = new Date();
        weekendStart.setDate(today.getDate() + daysUntilWeekend);
        const weekendEnd = new Date(weekendStart);
        weekendEnd.setDate(weekendEnd.getDate() + 1); // Sunday
        return (
          isMatch &&
          weekendStart >= new Date(event.eventStart) &&
          weekendEnd <= new Date(event.eventEnd)
        );
      }
    });

    setFilteredEvents(filtered);
  }, [allEvents, searchText, interval]);

  return (
    <div className="all-events-user-landing-page">
      <h1>All Events</h1>
      <div className="all-events-container">
        {isLoading ? (
          Array.from({ length: 8 }, (_, index) => (
            <Skeleton
              key={index}
              active={true}
              paragraph={{ rows: 5 }}
              size={"small"}
            />
          ))
        ) : filteredEvents.length > 0 ? (
          filteredEvents.slice(0, eventsCount).map((event, index) => {
            return (
              <EventCard
                key={event?._id}
                className="listing-event-card"
                event={event}
              />
            );
          })
        ) : (
          <p className="yellow">No events found.</p>
        )}
      </div>
      {allEvents.length > eventsCount && (
        <PrimaryButton
          className="events-load-more-button"
          onClick={() =>
            link ? navigate(link) : setEventsCount(eventsCount + 6)
          }
        >
          {link ? "Explore all" : "See more"}
        </PrimaryButton>
      )}
    </div>
  );
};

export default AllEvents;
