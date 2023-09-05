import React, { useState } from "react";
import "./CustomizeTickets.scss";
import EventsList from "../../Common/EventsList";
import formatDate from "../../../utilities/formatDate";
import PrimaryButton from "../../UI/PrimaryButton";

const CustomizeTickets = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="manage-customize-tickets-page">
      <EventsList
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
      />
      <div className="selected-event-ticket-cards">
        {selectedEvent?.tickets?.map((ticket) => {
          return (
            <div className="single-ticket-card">
              <div className="ticket-header">
                <p>{formatDate(ticket?.validFrom)}</p>
                <h5>{ticket?.ticketType?.toUpperCase()}</h5>
              </div>
              <h3>{ticket?.ticketName}</h3>
              <PrimaryButton className={"cutomize-ticket-button"}>
                Customize
              </PrimaryButton>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomizeTickets;
