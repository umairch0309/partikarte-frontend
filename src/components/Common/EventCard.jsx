import React from "react";
import "./EventCard.scss";
import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";
import formatDate from "../../utilities/formatDate";

const EventCard = ({ event, className, style }) => {
  const navigate = useNavigate();

  const minPriceTicket = event?.tickets?.reduce(
    (minTicket, currentTicket) =>
      currentTicket?.price < minTicket?.price ? currentTicket : minTicket,
    event?.tickets?.[0] || {}
  );
  return (
    <div
      onClick={() => {
        navigate(`/all-events/${event?._id}`);
      }}
      className={`single-event-card ${className}`}
      style={{ ...style }}
    >
      {event?.eventBanner ? (
        <img src={event?.eventBanner} alt={event?.eventName} />
      ) : (
        <div className="image-placeholder">No image</div>
      )}
      <div className="date-overlay">
        <ReactSVG src="/icons/tools/clock.svg" />
        <span>{formatDate(event?.eventStart)}</span>
      </div>
      <h3 className="event-heading">{event?.eventName}</h3>
      <div className="event-location">
        <ReactSVG src="/icons/tools/location.svg" />
        {event?.eventVenue}
      </div>
      {minPriceTicket?.price === undefined ? (
        <div className="event-price"> No tickets available</div>
      ) : (
        <div className="event-price">
          Starting from <strong>{`$${minPriceTicket?.price}`}</strong>
        </div>
      )}
    </div>
  );
};

export default EventCard;
