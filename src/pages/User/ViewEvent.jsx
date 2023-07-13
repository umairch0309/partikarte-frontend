import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewEvent.scss";
import FeaturedEvents from "../../components/UserLandingPagesSections/FeaturedEvents";
import { ReactSVG } from "react-svg";
import TicketCard from "../../components/Common/TicketCard";
import PrimaryButton from "../../components/UI/PrimaryButton";
import GoogleMapComponent from "../../components/service-components/GoogleMapComponent";

const ViewEvent = () => {
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const tickets = [
    {
      title: "Vstopnica, MAJA ZALOŽNIK z zasedbo",
      startDate: "2023-07-13T20:00:00.000Z",
      endDate: "2023-07-13T22:20:00.000Z",
      comment: "DDV ni obračunan v skladu s 43.členom ZDDV-1.",
      price: "10",
    },
    {
      title: "Vstopnica, MAJA ZALOŽNIK z zasedbo",
      startDate: "2023-07-13T20:00:00.000Z",
      endDate: "2023-07-13T22:20:00.000Z",
      comment: "DDV ni obračunan v skladu s 43.členom ZDDV-1.",
      price: "10",
    },
  ];

  const handleGetDirections = () => {
    const lat = 48.1121925; // Example latitude
    const lng = 17.0935551; // Example longitude
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    window.open(url, "_blank");
  };

  const butTicketsHandler = () => {
    navigate("/checkout");
  };

  return (
    <div className="view-event-user">
      <img
        className="event-header-image"
        src="/images/event-1.jpg"
        alt="event-1"
      />
      <div className="view-event-main">
        <div className="view-event-main-left">
          <div className="main-left-header">
            <h1>Introduction Basic Programming HTML & CSS</h1>
            <div className="header-details-container">
              <div className="details-item">
                <ReactSVG src="/icons/tools/calendar.svg" />
                <p>24 April, 2034</p>
              </div>
              <div className="details-item">
                <ReactSVG className="clock" src="/icons/tools/clock.svg" />
                <p>11:30am-4:30pm</p>
              </div>
              <div className="details-item">
                <ReactSVG src="/icons/tools/unfilled-location.svg" />
                <p>Club Cirrus</p>
              </div>
              <div className="details-item">
                <ReactSVG src="/icons/tools/user.svg" />
                <p>Kulturni zavod Zlata struna</p>
              </div>
            </div>
            <hr />
            <div className="event-description">
              <h3>Description</h3>
              <p>
                Maja Založnik - vokal <br /> Tadej Gruškovnjak - klavir
                <br /> Leon Žunec - kitara/sax
                <br /> Boštjan Videc - Bass Vid Žgajner - boben
                <br />
                <br /> Maja Založnik je v slovenskem prostoru s svojim
                neverjetnim vokalom prisotna že mnoga leta. Spremljali smo jo
                tako na različnih glasbenih izborih in oddajah, kot tudi na
                evrovizijskih tekmovanjih in koncertih v živo, kjer je izbranemu
                občinstvu predstavljala svoj bogat repertoar od popa, soula,
                rocka in funka. Velike uspehe je požela z visoko uvrstitvijo na
                THE VOICE OF GERMANY, kjer je opozorila nase kot talentirana
                pevka s super karizmatično prezenco.
                <br /> Na repertoarju bodo tako izbrane svetovne uspešnice kot
                avtorske skladbe, ki bodo večer lepo glasbeno zaokrožile.
                <br />
                <br /> INFO: www.slamic.siMaja Založnik - vokal
                <br /> Tadej Gruškovnjak - klavir
                <br /> Leon Žunec - kitara/sax
                <br /> Boštjan Videc - Bass
                <br /> Vid Žgajner - boben
                <br />
                <br /> Maja Založnik je v slovenskem prostoru s svojim
                neverjetnim vokalom prisotna že mnoga leta. Spremljali smo jo
                tako na različnih glasbenih izborih in oddajah, kot tudi na
                evrovizijskih tekmovanjih in koncertih v živo, kjer je izbranemu
                občinstvu predstavljala svoj bogat repertoar od popa, soula,
                rocka in funka. Velike uspehe je požela z visoko uvrstitvijo na
                THE VOICE OF GERMANY, kjer je opozorila nase kot talentirana
                pevka s super karizmatično prezenco .<br />
                <br /> Na repertoarju bodo tako izbrane svetovne uspešnice kot
                avtorske skladbe, ki bodo večer lepo glasbeno zaokrožile.
                <br />
                <br /> INFO: www.slamic.siMaja Založnik - vokal
                <br /> Tadej Gruškovnjak - klavir
                <br /> Leon Žunec - kitara/sax
                <br /> Boštjan Videc - Bass
                <br /> Vid Žgajner - boben
                <br />
                <br /> Maja Založnik je v slovenskem prostoru s svojim
                neverjetnim vokalom prisotna že mnoga leta. Spremljali smo jo
                tako na različnih glasbenih izborih in oddajah, kot tudi na
                evrovizijskih tekmovanjih in koncertih v živo, kjer je izbranemu
                občinstvu predstavljala svoj bogat repertoar od popa, soula,
                rocka in funka. Velike uspehe je požela z visoko uvrstitvijo na
                THE VOICE OF GERMANY, kjer je opozorila nase kot talentirana
                pevka s super karizmatično prezenco .
              </p>
            </div>
          </div>
        </div>
        <div className="view-event-main-right">
          <div className="all-tickets-container">
            <div className="tickets-header">
              <ReactSVG src="/icons/tools/tickets.svg" /> <h3>TICKETS</h3>
            </div>
            <div className="tickets-wrapper">
              {tickets.length > 0 ? (
                tickets.map((ticket, index) => {
                  return <TicketCard key={index} ticket={ticket} />;
                })
              ) : (
                <p>No tickets yet</p>
              )}
            </div>
            {tickets.length > 0 && (
              <>
                <PrimaryButton
                  onClick={butTicketsHandler}
                  className="buy-tickets-button"
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
          <div className="maps-container">
            <GoogleMapComponent setShowMap={setShowMap} />
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
          <div className="event-info-container">
            <div className="date-time-container">
              <ReactSVG src="/icons/tools/calendar.svg" />
              <div className="date-time-wrapper">
                <h4>
                  Starts: <span>Wednesday, 29.3.2023 • 19:30</span>
                </h4>
                <h4>
                  Ends: <span>Wednesday, 29.3.2023 • 19:30</span>
                </h4>
              </div>
            </div>
            <div className="location-container">
              <ReactSVG src="/icons/tools/unfilled-location.svg" />
              <h4>Slamič Kersnikova 11000 Ljubljana Slovenija</h4>
            </div>
            <div className="organizer-container">
              <ReactSVG src="/icons/tools/user.svg" />
              <h4>Kulturni zavod Zlata struna</h4>
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
  );
};

export default ViewEvent;
