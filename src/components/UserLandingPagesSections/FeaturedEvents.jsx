import React, { useRef } from "react";
import "./FeaturedEvents.scss";
import { ReactSVG } from "react-svg";
import EventCard from "../Common/EventCard";
import Slider from "react-slick";

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  initialSlide: 0,
  adaptiveHeight: true,
  autoplay: true,
  autoplaySpeed: 3000,
  dots: false,
  responsive: [
    {
      breakpoint: 1300,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
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
  {
    date: "September 17, 2023",
    image: "/images/event-3.jpg",
    title: "Mobile App Development Bootcamp",
    location: "City Center",
    price: "15",
  },
  {
    date: "October 21, 2023",
    image: "/images/event-1.jpg",
    title: "Data Science Conference",
    location: "Convention Center",
    price: "50",
  },
  {
    date: "November 8, 2023",
    image: "/images/event-2.jpg",
    title: "UX/UI Design Workshop",
    location: "Design Studio",
    price: "20",
  },
];

const FeaturedEvents = ({ titleStart, titleEnd, status }) => {
  const sliderRef = useRef();

  return (
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
          {DUMMY_EVENTS.map((event, index) => {
            return (
              <div key={index} className="single-slider-item">
                <EventCard event={event} />
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default FeaturedEvents;
