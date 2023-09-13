import React, { useState } from "react";
import "./CustomizeTickets.scss";
import EventsList from "../../Common/EventsList";
import formatDate from "../../../utilities/formatDate";
import PrimaryButton from "../../UI/PrimaryButton";
import { useNavigate } from "react-router-dom";

const CustomizeTickets = ({ setSelectedTicket }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();
  return (
    <div className="manage-customize-tickets-page">
      <EventsList
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
      />
      <div className="selected-event-ticket-cards">
        {selectedEvent?.tickets?.length > 0 ? (
          selectedEvent?.tickets?.map((ticket) => {
            return (
              <div className="single-ticket-card">
                <div className="ticket-header">
                  <p>{formatDate(ticket?.validFrom)}</p>
                  <h5>{ticket?.ticketType?.toUpperCase()}</h5>
                </div>
                <h3>{ticket?.ticketName}</h3>
                <p className="ticket-description">{ticket?.descriptionWeb}</p>
                <PrimaryButton
                  onClick={() => {
                    setSelectedTicket({ ticket, eventId: selectedEvent?._id });
                    navigate("./form");
                  }}
                  className={"cutomize-ticket-button"}
                >
                  Customize
                </PrimaryButton>
              </div>
            );
          })
        ) : (
          <p className="black">No tickets yet.</p>
        )}
      </div>
    </div>
  );
};

export default CustomizeTickets;
