import React, { createContext, useContext, useEffect, useReducer } from "react";

const initialState = {
  orderAmount: 0,
  totalTickets: 0,
  tickets: [],
  recommendations: false,
  eventId: null,
  discountCode: "",
};

const BookingContext = createContext();

function bookingReducer(state, action) {
  switch (action.type) {
    case "RESET_STATE":
      return { ...initialState, eventId: state.eventId };
    case "CHECK_EVENT":
      return {
        ...(action.eventId !== state.eventId ? initialState : state),
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
        orderAmount: updatedTickets.reduce(
          (total, obj) => total + obj.noOfTickets * obj.price,
          0
        ),
      };
    case "DELETE_TICKET":
      const ticketExists = state.tickets.findIndex(
        (t) => t.ticketId === action.ticket.ticketId
      );
      const tickets =
        ticketExists !== -1
          ? [
              ...state.tickets.slice(0, ticketExists),
              action.ticket,
              ...state.tickets.slice(ticketExists + 1),
            ]
          : [...state.tickets, action.ticket];
      return {
        ...state,
        tickets: tickets,
        orderAmount: tickets.reduce(
          (total, obj) => total + obj.noOfTickets * obj.price,
          0
        ),
      };
    default:
      return state;
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

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
