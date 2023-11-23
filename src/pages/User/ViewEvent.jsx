import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ViewEvent.scss";
import FeaturedEvents from "../../components/UserLandingPagesSections/FeaturedEvents";
import { ReactSVG } from "react-svg";
import TicketCard from "../../components/Common/TicketCard";
import PrimaryButton from "../../components/UI/PrimaryButton";
import GoogleMapComponent from "../../components/service-components/GoogleMapComponent";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import { useSingleEventForCustomer } from "../../api/manage-events";
import { Skeleton, message } from "antd";
import formatDate from "../../utilities/formatDate";
import { useBookingContext } from "../../context/booking-context";

const ViewEvent = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobileWidth();
  const { state, dispatch } = useBookingContext();
  const [showMap, setShowMap] = useState(false);
  const [data, setData] = useState(null);
  const { eventId } = useParams();

  const { isLoading } = useSingleEventForCustomer(eventId, (res) => {
    setData(res?.event);
    console.log(res?.event);
  });

  const handleGetDirections = () => {
    const lat = data?.eventCoordinatesY; // Example latitude
    const lng = data?.eventCoordinatesX; // Example longitude
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    window.open(url, "_blank");
  };

  const buyTicketsHandler = () => {
    if (state?.eventId && state?.eventId?.trim() !== "") {
      navigate("/checkout");
    } else {
      message.error("Please add ticket to your wishlist first.");
    }
  };

  const renderTickets = () => {
    return (
      <div className="all-tickets-container">
        <div className="tickets-header">
          <ReactSVG src="/icons/tools/tickets.svg" /> <h3>TICKETS</h3>
        </div>
        <div className="tickets-wrapper">
          {data?.tickets?.length > 0 ? (
            data?.tickets?.map((ticket, index) => {
              return (
                <TicketCard eventId={eventId} key={index} ticket={ticket} />
              );
            })
          ) : (
            <p>No tickets yet</p>
          )}
        </div>
        {data?.tickets?.length > 0 && (
          <>
            <PrimaryButton
              onClick={buyTicketsHandler}
              className="buy-tickets-button"
              disabled={!(data?.tickets?.length > 0)}
            >
              Buy Tickets
            </PrimaryButton>
            <div className="payment-methods">
              <ReactSVG
                className="payment-method"
                src="/icons/tools/mastercard.svg"
              />
              <ReactSVG
                className="payment-method"
                src="/icons/tools/visa.svg"
              />
              <ReactSVG
                className="payment-method"
                src="/icons/tools/mbills.svg"
              />
            </div>
          </>
        )}
      </div>
    );
  };

  return !isLoading ? (
    <div className="view-event-user">
      <img
        className="event-header-image"
        src={data?.eventBanner}
        alt="event-1"
      />
      <div className="view-event-main">
        <div className="view-event-main-left">
          <div className="main-left-header">
            <h1>{data?.eventName}</h1>
            <div className="header-details-container">
              <div className="details-item">
                <ReactSVG src="/icons/tools/calendar.svg" />
                <p>{formatDate(data?.eventStart)}</p>
              </div>
              <div className="details-item">
                <ReactSVG className="clock" src="/icons/tools/clock.svg" />
                <p>
                  {new Date(data?.eventStart).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}{" "}
                  -{" "}
                  {new Date(data?.eventEnd).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <div className="details-item">
                <ReactSVG src="/icons/tools/unfilled-location.svg" />
                <p>{data?.eventVenue}</p>
              </div>
              <div className="details-item">
                <ReactSVG src="/icons/tools/user.svg" />
                <p>{data?.businessId?.company?.companyName}</p>
              </div>
            </div>
            <hr />
            {isMobile && renderTickets()}

            <div className="event-description">
              <h3>Description</h3>
              <p>{data?.eventDescription}</p>
            </div>
          </div>
        </div>
        <div className="view-event-main-right">
          {!isMobile && renderTickets()}
          {data?.eventCoordinatesX && data?.eventCoordinatesY && (
            <div className="maps-container">
              <GoogleMapComponent
                setShowMap={setShowMap}
                styleOptions={{
                  width: "100%",
                  height: "296px",
                  padding: "10px",
                  borderRadius: "10px",
                }}
                center={{
                  lat: parseFloat(data?.eventCoordinatesY),
                  lng: parseFloat(data?.eventCoordinatesX),
                }}
              />
              {showMap && (
                <div className="get-directions-button-wrapper">
                  <PrimaryButton
                    className="get-directions-button"
                    onClick={handleGetDirections}
                  >
                    Get Directions
                  </PrimaryButton>
                </div>
              )}
            </div>
          )}
          <div className="event-info-container">
            <div className="date-time-container">
              <ReactSVG src="/icons/tools/calendar.svg" />
              <div className="date-time-wrapper">
                <h4>
                  Starts: <span>{formatDate(data?.eventStart)}</span>
                </h4>
                <h4>
                  Ends: <span>{formatDate(data?.eventEnd)}</span>
                </h4>
              </div>
            </div>
            <div className="location-container">
              <ReactSVG src="/icons/tools/unfilled-location.svg" />
              <h4>
                {data?.eventType === "Venue"
                  ? data?.eventAddress?.addressDescription
                  : data?.eventAddress?.eventLink}
              </h4>
            </div>
            <div className="organizer-container">
              <ReactSVG src="/icons/tools/user.svg" />
              <h4>{data?.businessId?.company?.companyName}</h4>
            </div>
          </div>
        </div>
      </div>
      <FeaturedEvents
        titleStart="Relevant"
        titleEnd="Events"
        status="Relevant"
      />
    </div>
  ) : (
    <>
      <Skeleton.Image
        style={{ width: "99.8vw", height: "370px", marginBottom: "40px" }}
        active={true}
      />
      <Skeleton active={true} paragraph={{ rows: 5 }} size={"small"} />
    </>
  );
};

export default ViewEvent;
