import React from "react";
import { ReactSVG } from "react-svg";
import "./CheckoutSelectedEvent.scss";
import { useState } from "react";

const CheckoutSelectedEvent = ({ eventTicket, setTotalPrice, totalPrice }) => {
  const [ticketCount, setTicketCount] = useState(eventTicket.quantity);

  return (
    <div className="selected-ticket-container">
      <div className="event-tile-left">
        <img src="/images/event-1.jpg" alt="event-images" />
        <div className="event-name-quantity">
          <h4>{eventTicket.title}</h4>
          <div className="quantity-select">
            <p>Qty</p>{" "}
            <select
              value={ticketCount}
              onChange={(e) => {
                const priceToBeSubstracted = ticketCount * eventTicket.price;
                setTicketCount(e.target.value);
                setTotalPrice(
                  eventTicket.price * e.target.value +
                    totalPrice -
                    priceToBeSubstracted
                );
              }}
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
          <h4>$ {eventTicket.price.toFixed(2)}</h4>
          <h6>Total: ${(eventTicket.price * ticketCount).toFixed(2)}</h6>
        </div>
        <button className="delete-button">
          <ReactSVG src="/icons/tools/delete.svg" />
        </button>
      </div>
    </div>
  );
};

export default CheckoutSelectedEvent;
