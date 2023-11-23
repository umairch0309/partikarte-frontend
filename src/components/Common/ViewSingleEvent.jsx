import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./ViewSingleEvent.scss";
import { ReactSVG } from "react-svg";
import PrimaryButton from "../UI/PrimaryButton";
import GoogleMapComponent from "../service-components/GoogleMapComponent";
import { useSingleEventForCustomer } from "../../api/manage-events";
import formatDate from "../../utilities/formatDate";
import { Skeleton } from "antd";

const ViewSingleEvent = () => {
  const [showMap, setShowMap] = useState(false);
  const [data, setData] = useState(null);
  const { eventId } = useParams();

  const { isLoading } = useSingleEventForCustomer(eventId, (res) => {
    setData(res?.event);
    console.log(res?.event);
    console.log(new Date(res?.event?.eventStart));
  });

  const handleGetDirections = () => {
    const lat = data?.eventCoordinatesY; // Example latitude
    const lng = data?.eventCoordinatesX; // Example longitude
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    window.open(url, "_blank");
  };

  return !isLoading && data?._id ? (
    <div className="view-event-user-component">
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

            <div className="event-description">
              <h3>Description</h3>
              <p>{data?.eventDescription}</p>
            </div>
          </div>
        </div>
        <div className="view-event-main-right">
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
                {data?.eventType == "Venue"
                  ? data?.eventAddress?.addressDescription
                  : "Online"}
              </h4>
            </div>
            <div className="organizer-container">
              <ReactSVG src="/icons/tools/user.svg" />
              <h4>{data?.businessId?.company?.companyName}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>
      <Skeleton.Image
        style={{
          width: "calc(100vw - 310px)",
          height: "370px",
          marginBottom: "40px",
        }}
        active={true}
      />
      <Skeleton active={true} paragraph={{ rows: 5 }} size={"small"} />
    </>
  );
};

export default ViewSingleEvent;
