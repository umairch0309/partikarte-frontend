import React from "react";
import { ReactSVG } from "react-svg";
import "./CheckoutSelectedEvent.scss";
import { useState } from "react";
import { useBookingContext } from "../../context/booking-context";

const CheckoutSelectedEvent = ({ ticket }) => {
  const { state, dispatch } = useBookingContext();

  const updateTicketInContext = (e) => {
    dispatch({
      type: "ADD_TICKET",
      ticket: {
        ticketId: ticket?.ticketId,
        noOfTickets: parseInt(e.target.value),
        price: ticket?.price,
        ticketName: ticket?.ticketName,
        show: true,
      },
    });
  };

  const deleteTicketInContext = () => {
    dispatch({
      type: "DELETE_TICKET",
      ticket: {
        ticketId: ticket?.ticketId,
        noOfTickets: 0,
        price: ticket?.price,
        ticketName: ticket?.ticketName,
        show: false,
      },
    });
  };

  return (
    <div className="selected-ticket-container">
      <div className="event-tile-left">
        <div className="event-name-quantity">
          <h4>{ticket.ticketName}</h4>
          <div className="quantity-select">
            <p>Qty</p>{" "}
            <select
              value={ticket?.noOfTickets}
              onChange={updateTicketInContext}
            >
              {Array.from({ length: 11 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="event-tile-right">
        <div className="price-container">
          <h4>$ {ticket.price.toFixed(2)}</h4>
          <h6>Total: ${(ticket.price * ticket?.noOfTickets).toFixed(2)}</h6>
        </div>
        <button onClick={deleteTicketInContext} className="delete-button">
          <ReactSVG src="/icons/tools/delete.svg" />
        </button>
      </div>
    </div>
  );
};

export default CheckoutSelectedEvent;
