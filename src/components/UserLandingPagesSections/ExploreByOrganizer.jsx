import React, { useRef } from "react";
import "./ExploreByOrganizer.scss";
import { ReactSVG } from "react-svg";
import EventCard from "../Common/EventCard";
import Slider from "react-slick";
import PrimaryButton from "../UI/PrimaryButton";
import { Link } from "react-router-dom";

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

const ExploreByOrganizer = () => {
  const sliderRef = useRef();

  return (
    <div className="explore-by-organizer-events-section">
      <div className="explore-by-organizer-events-header">
        <div className="header-left">
          <h1>
            Explore by <span>Organizer</span>
          </h1>
          <p>Lorem Ipsum is simply dummy text of the printing .</p>
        </div>
        <div className="header-right">
          <PrimaryButton className="explore-all-organizers">
            Explore all organizers
          </PrimaryButton>
          <ReactSVG
            onClick={() => sliderRef.current.slickPrev()}
            className="explore-by-organizer-header-arrow"
            src="/icons/tools/arrow-down-left.svg"
          />
          <ReactSVG
            onClick={() => sliderRef.current.slickNext()}
            className="explore-by-organizer-header-arrow"
            src="/icons/tools/arrow-up-right.svg"
          />
        </div>
      </div>
      <div className="explore-by-organizer-events-main">
        <Slider {...settings} ref={sliderRef}>
          {DUMMY_EVENTS.map((event, index) => {
            return (
              <div key={index} className="single-slider-item">
                <div className="gallery-item-container">
                  <img src={event.image} alt={event.title} />
                  <Link to={`/business-profile/${index}`}>
                    <div className="organizer-tag">
                      <img src={event.image} alt={event.title} />
                      <h5>Dummy Event llc.</h5>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default ExploreByOrganizer;
