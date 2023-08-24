import React, { useState } from "react";
import EventCard from "../Common/EventCard";
import PrimaryButton from "../UI/PrimaryButton";
import "./AllEvents.scss";
import { useNavigate } from "react-router-dom";
import { useAllEventsForCustomer } from "../../api/manage-events";
import { Skeleton } from "antd";

const DUMMY_EVENTS = [
  {
    date: "July 11, 2023",
    image: "/images/event-1.jpg",
    title: "Introduction to Web Development",
    location: "Club Cirrus",
    price: "10",
    _id: "event-1",
  },
  {
    date: "August 5, 2023",
    image: "/images/event-2.jpg",
    title: "Advanced JavaScript Workshop",
    location: "Tech Hub",
    price: "25",
    _id: "event-2",
  },
  {
    date: "September 17, 2023",
    image: "/images/event-3.jpg",
    title: "Mobile App Development Bootcamp",
    location: "City Center",
    price: "15",
    _id: "event-3",
  },
  {
    date: "October 21, 2023",
    image: "/images/event-1.jpg",
    title: "Data Science Conference",
    location: "Convention Center",
    price: "50",
    _id: "event-4",
  },
  {
    date: "November 8, 2023",
    image: "/images/event-2.jpg",
    title: "UX/UI Design Workshop",
    location: "Design Studio",
    price: "20",
    _id: "event-5",
  },
  {
    date: "September 17, 2023",
    image: "/images/event-3.jpg",
    title: "Mobile App Development Bootcamp",
    location: "City Center",
    price: "15",
    _id: "event-6",
  },
  {
    date: "October 21, 2023",
    image: "/images/event-1.jpg",
    title: "Data Science Conference",
    location: "Convention Center",
    price: "50",
    _id: "event-7",
  },
  {
    date: "November 8, 2023",
    image: "/images/event-2.jpg",
    title: "UX/UI Design Workshop",
    location: "Design Studio",
    price: "20",
    _id: "event-8",
  },
  {
    date: "September 17, 2023",
    image: "/images/event-3.jpg",
    title: "Mobile App Development Bootcamp",
    location: "City Center",
    price: "15",
    _id: "event-9",
  },
];

const AllEvents = ({ link }) => {
  const [eventsCount, setEventsCount] = useState(6);
  const [allEvents, setAllEvents] = useState([]);
  const navigate = useNavigate();
  const { isLoading } = useAllEventsForCustomer((res) => {
    setAllEvents(res?.events);
  });
  return (
    <div className="all-events-user-landing-page">
      <div className="all-events-container">
        {!(allEvents.length > 0) && isLoading ? (
          <>
            <Skeleton active={true} paragraph={{ rows: 5 }} size={"small"} />
            <Skeleton active={true} paragraph={{ rows: 5 }} size={"small"} />
          </>
        ) : (
          allEvents.slice(0, eventsCount).map((event, index) => {
            return (
              <EventCard
                key={event?._id}
                className="listing-event-card"
                event={event}
              />
            );
          })
        )}
      </div>
      {allEvents.length > eventsCount && (
        <PrimaryButton
          className="events-load-more-button"
          onClick={() =>
            link ? navigate(link) : setEventsCount(eventsCount + 3)
          }
        >
          Explore all
        </PrimaryButton>
      )}
    </div>
  );
};

export default AllEvents;
