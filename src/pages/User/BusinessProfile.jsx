import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import "./BusinessProfile.scss";
import EventCard from "../../components/Common/EventCard";
import FeaturedEvents from "../../components/UserLandingPagesSections/FeaturedEvents";
import NewsCard from "../../components/Common/NewsCard";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import { useSingleBusinessForCustomer } from "../../api/business";
import { useParams } from "react-router-dom";
import { message } from "antd";

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
  const isMobile = useIsMobileWidth();
  const { businessId } = useParams();
  const [data, setData] = useState(null);
  const { isLoading } = useSingleBusinessForCustomer(businessId, (res) => {
    setData(res?.data ?? res);
  });

  const copyToClipboard = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Link copied to clipboard.");
      })
      .catch((error) => {
        message.error("Couldn't copy to clipboard.");
      });
  };

  const latestEvents = () => {
    return (
      <div className="events-container">
        <div className="events-header">
          <ReactSVG src="/icons/tools/calendar-filled.svg" />{" "}
          <h3>Latest Events</h3>
        </div>
        <div className="events-wrapper">
          {Array.isArray(data?.events) && data.events.length > 0 ? (
            data.events.slice(0, 2).map((event, index) => {
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
    );
  };

  return (
    <div className="business-profile">
      <img
        className="event-header-image"
        src={
          data?.business?.organizerImageBanner || "/images/business-profile.jpg"
        }
        alt="event-1"
      />
      <div className="business-profile">
        <div className="business-profile-left">
          <div className="main-left-header">
            <h1>{data?.business?.company?.companyName}</h1>
            {isMobile && latestEvents()}
            <div className="business-profile-description">
              <p>{data?.business?.description}</p>
            </div>
          </div>
        </div>
        <div className="business-profile-right">
          {!isMobile && latestEvents()}
          <div className="news-container">
            <div className="news-header">
              <ReactSVG src="/icons/tools/news-tag.svg" /> <h3>News</h3>
            </div>
            <div className="news-wrapper">
              {Array.isArray(data?.news) && data.news.length > 0 ? (
                data.news.slice(0, 2).map((news, index) => {
                  return (
                    <NewsCard
                      key={index}
                      className="listing-news-card"
                      news={news}
                    />
                  );
                })
              ) : (
                <p>No news yet</p>
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
                <h5>{data?.business?.company?.companyName}</h5>
              </div>{" "}
              <div className="info-item">
                <div className="info-item-header">
                  <ReactSVG src="/icons/tools/percentage-icon.svg" />
                  <p>VAT number:</p>
                </div>
                <h5>{data?.business?.company?.companyVAT}</h5>
              </div>{" "}
              <div className="info-item">
                <div className="info-item-header">
                  <ReactSVG src="/icons/tools/at-sign.svg" />
                  <p>Email:</p>
                </div>
                <h5>{data?.business?.contactInformation?.email}</h5>
              </div>{" "}
              <div className="info-item">
                <div className="info-item-header">
                  <ReactSVG src="/icons/tools/phone-icon.svg" />
                  <p>Phone:</p>
                </div>
                <h5>{data?.business?.contactInformation?.phoneNumber}</h5>
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
                    onClick={() =>
                      copyToClipboard(data?.business?.socialLinks?.facebook)
                    }
                    className="copy-button"
                    src="/icons/tools/copy.svg"
                  />
                </div>
                <div className="social-media-item">
                  <div className="social-media-item-left">
                    <ReactSVG src="/icons/tools/instagram-color.svg" />
                    <h5>Instagram</h5>
                  </div>
                  <ReactSVG
                    onClick={() =>
                      copyToClipboard(data?.business?.socialLinks?.instagram)
                    }
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
                    onClick={() =>
                      copyToClipboard(data?.business?.socialLinks?.linkedin)
                    }
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
