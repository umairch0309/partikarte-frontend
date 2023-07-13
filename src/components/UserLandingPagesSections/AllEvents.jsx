import React, { useState } from "react";
import EventCard from "../Common/EventCard";
import PrimaryButton from "../UI/PrimaryButton";
import "./AllEvents.scss";
import { useNavigate } from "react-router-dom";

const DUMMY_EVENTS = [
  {
    date: "July 11, 2023",
    image: "/images/event-1.jpg",
    title: "Introduction to Web Development",
    location: "Club Cirrus",
    price: "10",
  },
  {
    date: "August 5, 2023",
    image: "/images/event-2.jpg",
    title: "Advanced JavaScript Workshop",
    location: "Tech Hub",
    price: "25",
  },
  {
    date: "September 17, 2023",
    image: "/images/event-3.jpg",
    title: "Mobile App Development Bootcamp",
    location: "City Center",
    price: "15",
  },
  {
    date: "October 21, 2023",
    image: "/images/event-1.jpg",
    title: "Data Science Conference",
    location: "Convention Center",
    price: "50",
  },
  {
    date: "November 8, 2023",
    image: "/images/event-2.jpg",
    title: "UX/UI Design Workshop",
    location: "Design Studio",
    price: "20",
  },
  {
    date: "September 17, 2023",
    image: "/images/event-3.jpg",
    title: "Mobile App Development Bootcamp",
    location: "City Center",
    price: "15",
  },
  {
    date: "October 21, 2023",
    image: "/images/event-1.jpg",
    title: "Data Science Conference",
    location: "Convention Center",
    price: "50",
  },
  {
    date: "November 8, 2023",
    image: "/images/event-2.jpg",
    title: "UX/UI Design Workshop",
    location: "Design Studio",
    price: "20",
  },
  {
    date: "September 17, 2023",
    image: "/images/event-3.jpg",
    title: "Mobile App Development Bootcamp",
    location: "City Center",
    price: "15",
  },
];

const AllEvents = ({ link }) => {
  const [eventsCount, setEventsCount] = useState(6);
  const navigate = useNavigate();
  return (
    <div className="all-events-user-landing-page">
      <div className="all-events-container">
        {DUMMY_EVENTS.slice(0, eventsCount).map((event, index) => {
          return (
            <EventCard
              key={index}
              className="listing-event-card"
              event={event}
            />
          );
        })}
      </div>
      {DUMMY_EVENTS.length > eventsCount && (
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
