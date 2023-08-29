import React, { useRef, useState } from "react";
import "./FeaturedEvents.scss";
import { ReactSVG } from "react-svg";
import EventCard from "../Common/EventCard";
import Slider from "react-slick";
import { useAllEventsForCustomer } from "../../api/manage-events";
import { Skeleton } from "antd";

const settings = {
  infinite: true,
  speed: 500,
  slidesToScroll: 1,
  initialSlide: 0,
  adaptiveHeight: true,
  autoplay: true,
  autoplaySpeed: 3000,
  dots: false,
  responsive: [
    {
      breakpoint: 2440,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    {
      breakpoint: 1840,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    {
      breakpoint: 1440,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    {
      breakpoint: 1100,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    {
      breakpoint: 700,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const FeaturedEvents = ({ titleStart, titleEnd, status }) => {
  const sliderRef = useRef();

  const [allEvents, setAllEvents] = useState([]);
  const { isLoading: allEventsLoading } = useAllEventsForCustomer((res) => {
    setAllEvents(res?.events);
  });

  return !allEventsLoading ? (
    <div className="featured-events-section">
      <div className="featured-events-header">
        <div className="header-left">
          <p>{status}</p>
          <h1>
            {titleStart} <span>{titleEnd}</span>
          </h1>
        </div>
        <div className="header-right">
          <ReactSVG
            onClick={() => sliderRef.current.slickPrev()}
            className="featured-header-arrow arrow-left"
            src="/icons/tools/arrow-head-left.svg"
          />
          <ReactSVG
            onClick={() => sliderRef.current.slickNext()}
            className="featured-header-arrow arrow-right"
            src="/icons/tools/arrow-head-right.svg"
          />
        </div>
      </div>
      <div className="featured-events-main">
        <Slider {...settings} ref={sliderRef}>
          {allEvents?.map((event, index) => {
            return (
              <div key={index} className="single-slider-item">
                <EventCard className="event-in-slider-item" event={event} />
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  ) : (
    <Skeleton
      style={{ marginBlock: "10vh" }}
      active={true}
      paragraph={{ rows: 5 }}
      size={"large"}
    />
  );
};

export default FeaturedEvents;
