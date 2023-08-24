import React, { useEffect, useState } from "react";
import PrimaryButton from "../UI/PrimaryButton";
import "./TicketCard.scss";
import { useBookingContext } from "../../context/booking-context";
import formatDate from "../../utilities/formatDate";

const TicketCard = ({ ticket, eventId }) => {
  const { state, dispatch } = useBookingContext();
  const ticketIndexInContext = state.tickets.findIndex(
    (t) => t.ticketId === ticket._id
  );
  const [ticketCount, setTicketCount] = useState(
    ticketIndexInContext !== -1 && eventId === state.eventId
      ? state.tickets[ticketIndexInContext].noOfTickets
      : 0
  );

  useEffect(() => {
    if (state.eventId === eventId) {
      dispatch({
        type: "ADD_TICKET",
        ticket: {
          ticketId: ticket?._id,
          noOfTickets: ticketCount,
          price: ticket?.price,
        },
      });
    }
  }, [state.eventId]);

  return (
    <div className="ticket-card-container">
      <div className="ticket-card-top">
        <h4 className="ticket-title">{ticket?.ticketName}</h4>
        <p className="ticket-time-date">
          Available from {formatDate(ticket?.validFrom)} to{" "}
          {formatDate(ticket?.validTo)}
        </p>
        <p>{ticket?.descriptionWeb}</p>
      </div>
      <hr />
      <div className="ticket-card-bottom">
        <div className="ticket-card-bottom-controls-container">
          <h4 className="price">${ticket?.price}</h4>
          <div className="buttons-container">
            <PrimaryButton
              onClick={() =>
                setTicketCount(
                  ticketCount - 1 >= 0 ? ticketCount - 1 : ticketCount
                )
              }
              className="quantity-button"
            >
              -
            </PrimaryButton>
            <h4>{ticketCount.toString().padStart(2, "0")}</h4>
            <PrimaryButton
              onClick={() =>
                setTicketCount(
                  ticketCount + 1 <= 10 ? ticketCount + 1 : ticketCount
                )
              }
              className="quantity-button"
            >
              +
            </PrimaryButton>
          </div>
        </div>
        <div
          className="add-to-wishlist-button"
          onClick={() => {
            if (state.eventId === eventId) {
              dispatch({
                type: "ADD_TICKET",
                ticket: {
                  ticketId: ticket?._id,
                  noOfTickets: ticketCount,
                  price: ticket?.price,
                },
              });
            } else {
              dispatch({
                type: "CHECK_EVENT",
                eventId,
              });
            }
          }}
        >
          <img src="/icons/tools/wand.png" height={22} width={20} /> Add to
          wishlist
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
