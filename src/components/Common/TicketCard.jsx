import React, { useEffect, useState } from "react";
import PrimaryButton from "../UI/PrimaryButton";
import "./TicketCard.scss";
import { useBookingContext } from "../../context/booking-context";
import formatDate from "../../utilities/formatDate";
import { message } from "antd";
import CustomModal from "../UI/CustomModal";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import { useLocation } from "react-router-dom";
import currencySymbolGenerator from "../../utilities/currencySymbolGenerator";

const TicketCard = ({ ticket, eventId, eventCurrency }) => {
  const { state, dispatch } = useBookingContext();
  const isMobile = useIsMobileWidth();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const couponCode = queryParams.get("couponCode");

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questions, setQuestions] = useState(ticket?.questions || []);
  const [questionErrors, setQuestionErrors] = useState([]);
  const ticketIndexInContext = state.tickets.findIndex(
    (t) => t.ticketId === ticket._id
  );
  const [ticketCount, setTicketCount] = useState(
    ticketIndexInContext !== -1 && eventId === state.eventId
      ? state.tickets[ticketIndexInContext].noOfTickets
      : 0
  );

  const now = new Date();
  const validFrom = new Date(ticket?.validFrom);
  const validTo = new Date(ticket?.validTo);

  useEffect(() => {
    if (state.eventId === eventId) {
      dispatch({
        type: "ADD_TICKET",
        ticket: {
          ...state.tickets[ticketIndexInContext],
          ticketId: ticket?._id,
          noOfTickets: ticketCount,
          ticketVat: ticket?.vat,
          price: ticket?.price,
          ticketName: ticket?.ticketName,
          allQuestions: [],
          show:
            parseInt(ticket?.maxCapacity) >=
              parseInt(ticket?.remainingCapacity) &&
            now >= validFrom &&
            now <= validTo,
        },
      });
    }
  }, [state.eventId]);

  console.log(state, " booking statue");

  const onAddToWishlist = (count, action) => {
    if (state.eventId === eventId) {
      if (ticket?.questions && ticket?.questions?.length > 0) {
        if (action !== "remove") {
          setShowQuestionModal(true);
        }
      } else {
        setTicketCount(count);
        dispatch({
          type: "ADD_TICKET",
          ticket: {
            ticketId: ticket?._id,
            noOfTickets: count,
            ticketVat: ticket?.vat,
            price: ticket?.price,
            ticketName: ticket?.ticketName,
            show: true,
            allQuestions: [],
          },
        });
      }
      if (
        state.tickets?.find((t) => t.ticketId === ticket._id)?.noOfTickets !==
        count
      ) {
        if (
          state.tickets?.find((t) => t.ticketId === ticket._id)?.noOfTickets <
          count
        ) {
          if (count > 1 && !(ticket?.questions?.length > 0)) {
            message.success("Ticket added to wishlist.");
          }
        } else if (
          state.tickets?.find((t) => t.ticketId === ticket._id)?.noOfTickets ==
            10 &&
          count == 10
        ) {
          message.info("You can't buy more tickets of same type.");
        } else if (
          state.tickets?.find((t) => t.ticketId === ticket._id)?.noOfTickets >
          count
        ) {
          message.info("Selected ticket count adjusted in wishlist.");
        }
      } else if (
        state.tickets?.find((t) => t.ticketId === ticket._id)?.noOfTickets ==
          10 &&
        count == 10
      ) {
        message.info("You can't buy more tickets of same type.");
      } else {
        message.warning(
          "Please add more or remove tickets to change wishlist."
        );
      }
    } else {
      dispatch({
        type: "CHECK_EVENT",
        eventId,
        discountCode: couponCode || "",
      });

      if (count) {
        if (count === 1 && ticket?.questions?.length > 0) {
          setShowQuestionModal(true);
        } else {
          setTicketCount(count);
          message.success("Ticket added to wishlist.");
        }
      }
    }
  };

  const handleQuestionAnswerChange = (value, index) => {
    setQuestions((prev) => [
      ...prev.map((question, i) => {
        if (i === index) {
          return {
            ...question,
            answer: value,
          };
        } else {
          return {
            ...question,
            ...(question?.answer && question?.answer?.trim()?.length > 0
              ? { answer: question.answer }
              : { answer: "" }),
          };
        }
      }),
    ]);
  };

  // console.log(state, "booking state");

  const questionsFormHandler = (e) => {
    e.preventDefault();
    const emptyAnswersArray = [];
    questions.forEach((question) => {
      const isNotEmpty = question.answer && question.answer.trim() !== "";
      emptyAnswersArray.push(!isNotEmpty);
    });
    setQuestionErrors(emptyAnswersArray);

    if (Object.keys(emptyAnswersArray.filter((el) => el === true)).length > 0) {
      console.log("errors");
      return;
    } else {
      console.log("no errors");
      setTicketCount(ticketCount + 1 <= 10 ? ticketCount + 1 : ticketCount);
      dispatch({
        type: "ADD_TICKET",
        ticket: {
          ticketId: ticket?._id,
          noOfTickets: ticketCount + 1 <= 10 ? ticketCount + 1 : ticketCount,
          price: ticket?.price,
          ticketVat: ticket?.vat,
          ticketName: ticket?.ticketName,
          show: true,
          allQuestions: [
            ...state.tickets[ticketIndexInContext].allQuestions,
            { questions },
          ],
        },
      });
      message.success("Ticket added to wishlist.");

      setQuestionErrors([]);
      setQuestions(ticket?.questions || []);
      setShowQuestionModal(false);
    }
  };

  return (
    <>
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
        {parseInt(ticket?.maxCapacity) >=
        parseInt(ticket?.remainingCapacity) ? (
          now >= validFrom && now <= validTo ? (
            <div className="ticket-card-bottom">
              <div className="ticket-card-bottom-controls-container">
                <h4 className="price">
                  {currencySymbolGenerator(eventCurrency)}
                  {ticket?.price}
                </h4>
                <div className="buttons-container">
                  <PrimaryButton
                    onClick={() => {
                      setTicketCount(
                        ticketCount - 1 >= 0 ? ticketCount - 1 : ticketCount
                      );
                      onAddToWishlist(
                        ticketCount - 1 >= 0 ? ticketCount - 1 : ticketCount,
                        "remove"
                      );
                    }}
                    className="quantity-button"
                  >
                    -
                  </PrimaryButton>
                  <h4>{ticketCount.toString().padStart(2, "0")}</h4>
                  <PrimaryButton
                    onClick={() => {
                      if (
                        !(
                          parseInt(ticket?.remainingCapacity) - ticketCount <=
                          0
                        )
                      ) {
                        onAddToWishlist(
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
              {/* <div className="add-to-wishlist-button" onClick={onAddToWishlist}>
              <img src="/icons/tools/wand.png" height={22} width={20} /> Add to
              wishlist
            </div> */}
            </div>
          ) : (
            <p className="yellow">Currently, you can't buy this ticket.</p>
          )
        ) : (
          <p className="red">Sorry, the tickets ended.</p>
        )}
      </div>

      <CustomModal
        onCancel={() => {
          setShowQuestionModal(false);
          setQuestionErrors([]);
          setQuestions(ticket?.questions || []);
        }}
        open={showQuestionModal}
        onOk={() => {
          setShowQuestionModal(false);
          setQuestionErrors([]);
          setQuestions(ticket?.questions || []);
        }}
        title={"Answer Questions"}
        subtitle={"Please answer questions to add ticket."}
        width={!isMobile && 700}
      >
        <form
          className="add-new-ticket-form-container"
          onSubmit={questionsFormHandler}
        >
          {questions?.length > 0 &&
            questions.map((question, index) => {
              return (
                <div
                  className={`single-form-item ${
                    questionErrors[index] ? "error" : ""
                  }`}
                >
                  <label htmlFor={`question[${index}].label`}>
                    {question.label}
                  </label>
                  <input
                    name={`question[${index}].answer`}
                    type="text"
                    id={`question[${index}].answer`}
                    placeholder="Write answer"
                    onChange={(e) =>
                      handleQuestionAnswerChange(e.target.value, index)
                    }
                    value={question.answer || ""}
                  />
                  {questionErrors[index] && (
                    <p className="error-message">{"Invalid!"}</p>
                  )}
                </div>
              );
            })}
          <PrimaryButton className={"form-submit-button"}>
            Submit & Add Ticket
          </PrimaryButton>
        </form>
      </CustomModal>
    </>
  );
};

export default TicketCard;
