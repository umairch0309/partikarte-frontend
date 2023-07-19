import React from "react";
import "./EventCard.scss";
import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event, className }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/all-events/1")}
      className={`single-event-card ${className}`}
    >
      {event?.image ? (
        <img src={event?.image} alt={event?.title} />
      ) : (
        <div className="image-placeholder">No image</div>
      )}
      <div className="date-overlay">
        <ReactSVG src="/icons/tools/clock.svg" />
        <span>{event?.date}</span>
      </div>
      <h3 className="event-heading">{event?.title}</h3>
      <div className="event-location">
        <ReactSVG src="/icons/tools/location.svg" />
        {event?.location}
      </div>
      <div className="event-price">${event?.price}</div>
    </div>
  );
};

export default EventCard;
