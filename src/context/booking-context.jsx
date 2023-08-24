import React, { createContext, useContext, useEffect, useReducer } from "react";

const initialState = {
  orderAmount: 0,
  totalTickets: 0,
  tickets: [],
  recommendations: false,
  eventId: null,
};

const BookingContext = createContext();

function bookingReducer(state, action) {
  switch (action.type) {
    case "CHECK_EVENT":
      return {
        ...(action.eventId === state.eventId ? initialState : state),
        eventId: action.eventId,
      };
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "ADD_TICKET":
      const existingTicketIndex = state.tickets.findIndex(
        (t) => t.ticketId === action.ticket.ticketId
      );

      const updatedTickets =
        existingTicketIndex !== -1
          ? [
              ...state.tickets.slice(0, existingTicketIndex),
              action.ticket,
              ...state.tickets.slice(existingTicketIndex + 1),
            ]
          : [...state.tickets, action.ticket];

      return {
        ...state,
        tickets: updatedTickets,
      };

    case "REMOVE_TICKET":
      return {
        ...state,
        tickets: state.tickets.filter(
          (ticket) => ticket._id !== action.ticket._id
        ),
      };
    default:
      return state;
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  console.log(state);

  useEffect(() => {
    let totalTickets = 0;
    state.tickets.forEach((ticket) => {
      totalTickets += ticket.noOfTickets;
    });
    dispatch({
      type: "UPDATE_FIELD",
      field: "totalTickets",
      value: totalTickets,
    });
  }, [state.tickets]);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  return useContext(BookingContext);
}
