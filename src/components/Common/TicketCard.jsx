import React, { useState } from "react";
import PrimaryButton from "../UI/PrimaryButton";
import "./TicketCard.scss";
import { ReactSVG } from "react-svg";

const TicketCard = ({ ticket }) => {
  const [ticketCount, setTicketCount] = useState(0);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    return `${date.getDate().toString().padStart(2, "0")}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${date.getFullYear()} • ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="ticket-card-container">
      <div className="ticket-card-top">
        <h4 className="ticket-title">{ticket.title}</h4>
        <p className="ticket-time-date">
          Available from {formatDate(ticket.startDate)} to{" "}
          {formatDate(ticket.endDate)}
        </p>
        <p>{ticket.comment}</p>
      </div>
      <hr />
      <div className="ticket-card-bottom">
        <div className="ticket-card-bottom-controls-container">
          <h4 className="price">${ticket.price}</h4>
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
        <div className="add-to-wishlist-button">
          <img src="/icons/tools/wand.png" height={22} width={20} /> Add to
          wishlist
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
