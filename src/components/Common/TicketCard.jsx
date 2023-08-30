import React, { useEffect, useState } from "react";
import PrimaryButton from "../UI/PrimaryButton";
import "./TicketCard.scss";
import { useBookingContext } from "../../context/booking-context";
import formatDate from "../../utilities/formatDate";
import { message } from "antd";

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
          ticketName: ticket?.ticketName,
          show: true,
        },
      });
    }
  }, [state.eventId]);

  const onAddToWishlist = () => {
    if (state.eventId === eventId) {
      dispatch({
        type: "ADD_TICKET",
        ticket: {
          ticketId: ticket?._id,
          noOfTickets: ticketCount,
          price: ticket?.price,
          ticketName: ticket?.ticketName,
          show: true,
        },
      });
      if (
        state.tickets?.find((t) => t.ticketId === ticket._id)?.noOfTickets !==
        ticketCount
      ) {
        if (
          state.tickets?.find((t) => t.ticketId === ticket._id)?.noOfTickets <
          ticketCount
        ) {
          message.success("Ticket added to wishlist.");
        } else {
          message.info("Selected ticket count adjusted in wishlist.");
        }
      } else {
        message.warning(
          "Please add more or remove tickets to change wishlist."
        );
      }
    } else {
      dispatch({
        type: "CHECK_EVENT",
        eventId,
      });
      message.success("Ticket added to wishlist.");
    }
  };

  const now = new Date();
  const validFrom = new Date(ticket?.validFrom);
  const validTo = new Date(ticket?.validTo);

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
      {ticket?.remainingCapacity >= ticket?.maxCapacity ? (
        now >= validFrom && now <= validTo ? (
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
                  onClick={() => {
                    if (
                      !(parseInt(ticket?.remainingCapacity) - ticketCount <= 0)
                    ) {
                      setTicketCount(
                        ticketCount + 1 <= 10 ? ticketCount + 1 : ticketCount
                      );
                    }
                  }}
                  className="quantity-button"
                  disabled={
                    parseInt(ticket?.remainingCapacity) - ticketCount <= 0
                  }
                >
                  +
                </PrimaryButton>
              </div>
            </div>
            {parseInt(ticket?.remainingCapacity) - ticketCount <= 0 && (
              <p className="red margin-top-10">Ticket limit reached.</p>
            )}
            <div className="add-to-wishlist-button" onClick={onAddToWishlist}>
              <img src="/icons/tools/wand.png" height={22} width={20} /> Add to
              wishlist
            </div>
          </div>
        ) : (
          <p className="yellow">Currently, you can't buy this ticket.</p>
        )
      ) : (
        <p className="red">Sorry, the tickets ended.</p>
      )}
    </div>
  );
};

export default TicketCard;
