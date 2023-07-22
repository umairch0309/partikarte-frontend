import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import "./BusinessProfile.scss";
import EventCard from "../../components/Common/EventCard";
import FeaturedEvents from "../../components/UserLandingPagesSections/FeaturedEvents";
import NewsCard from "../../components/Common/NewsCard";

const BusinessProfile = () => {
  const DUMMY_EVENTS = [
    {
      date: "July 11, 2023",
      image: "/images/event-1.jpg",
      title: "Introduction to Web Development",
      location: "Club Cirrus",
      price: "10",
    },
    {
      date: "August 5, 2023",
      image: "/images/event-2.jpg",
      title: "Advanced JavaScript Workshop",
      location: "Tech Hub",
      price: "25",
    },
  ];
  const DUMMY_NEWS = [
    {
      title: "We have update a new events in Maxico which will come up soon.",
      description:
        "Some description about this news will be there which user can open by clicking on this card and where will be no any type of action button user just need to click on this card",
      date: "24 Jul, 2023",
      tag: "Party events",
    },
    {
      title: "We have update a new events in Maxico which will come up soon.",
      description:
        "Some description about this news will be there which user can open by clicking on this card and where will be no any type of action button user just need to click on this card",
      date: "24 Jul, 2023",
      tag: "Party events",
    },
    {
      title: "We have update a new events in Maxico which will come up soon.",
      description:
        "Some description about this news will be there which user can open by clicking on this card and where will be no any type of action button user just need to click on this card",
      date: "24 Jul, 2023",
      tag: "Party events",
    },
  ];

  return (
    <div className="business-profile">
      <img
        className="event-header-image"
        src="/images/business-profile.jpg"
        alt="event-1"
      />
      <div className="business-profile">
        <div className="business-profile-left">
          <div className="main-left-header">
            <h1>Jorge Party Maker</h1>
            <div className="business-profile-description">
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
        <div className="business-profile-right">
          <div className="events-container">
            <div className="events-header">
              <ReactSVG src="/icons/tools/calendar-filled.svg" />{" "}
              <h3>Latest Events</h3>
            </div>
            <div className="events-wrapper">
              {DUMMY_EVENTS.length > 0 ? (
                DUMMY_EVENTS.slice(0, 2).map((event, index) => {
                  return (
                    <EventCard
                      key={index}
                      className="listing-event-card"
                      event={event}
                    />
                  );
                })
              ) : (
                <p>No events yet</p>
              )}
            </div>
          </div>

          <div className="news-container">
            <div className="news-header">
              <ReactSVG src="/icons/tools/news-tag.svg" /> <h3>News</h3>
            </div>
            <div className="news-wrapper">
              {DUMMY_NEWS.length > 0 ? (
                DUMMY_NEWS.slice(0, 2).map((news, index) => {
                  return (
                    <NewsCard
                      key={index}
                      className="listing-news-card"
                      news={news}
                    />
                  );
                })
              ) : (
                <p>No events yet</p>
              )}
            </div>
          </div>

          <div className="business-profile-info-container">
            <div className="info-items-container">
              <div className="info-item">
                <div className="info-item-header">
                  <ReactSVG src="/icons/tools/building-icon.svg" />
                  <p>Company Name:</p>
                </div>
                <h5>Events Company</h5>
              </div>{" "}
              <div className="info-item">
                <div className="info-item-header">
                  <ReactSVG src="/icons/tools/percentage-icon.svg" />
                  <p>VAT number:</p>
                </div>
                <h5>59342875984375</h5>
              </div>{" "}
              <div className="info-item">
                <div className="info-item-header">
                  <ReactSVG src="/icons/tools/at-sign.svg" />
                  <p>Email:</p>
                </div>
                <h5>eventscompany@gmail.com</h5>
              </div>{" "}
              <div className="info-item">
                <div className="info-item-header">
                  <ReactSVG src="/icons/tools/phone-icon.svg" />
                  <p>Phone:</p>
                </div>
                <h5>1 2343 23423 23432</h5>
              </div>
            </div>
            <hr />
            <div className="social-media-container">
              <h4>Social Media:</h4>
              <div className="social-media-container-bottom">
                <div className="social-media-item">
                  <div className="social-media-item-left">
                    <ReactSVG src="/icons/tools/facebook-color.svg" />
                    <h5>Facebook</h5>
                  </div>
                  <ReactSVG
                    className="copy-button"
                    src="/icons/tools/copy.svg"
                  />
                </div>
                <div className="social-media-item">
                  <div className="social-media-item-left">
                    <ReactSVG src="/icons/tools/insta-color.svg" />
                    <h5>Instagram</h5>
                  </div>
                  <ReactSVG
                    className="copy-button"
                    src="/icons/tools/copy.svg"
                  />
                </div>
                <div className="social-media-item">
                  <div className="social-media-item-left">
                    <ReactSVG src="/icons/tools/linkedin-color.svg" />
                    <h5>Linkedin</h5>
                  </div>
                  <ReactSVG
                    className="copy-button"
                    src="/icons/tools/copy.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FeaturedEvents
        titleStart="Past"
        titleEnd="Events"
        status="Events Portfolio"
      />
    </div>
  );
};

export default BusinessProfile;
