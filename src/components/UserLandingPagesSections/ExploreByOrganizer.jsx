import React, { useRef, useState } from "react";
import "./ExploreByOrganizer.scss";
import { ReactSVG } from "react-svg";
import Slider from "react-slick";
import PrimaryButton from "../UI/PrimaryButton";
import { Link, useNavigate } from "react-router-dom";
import { useAllBusinessesForCustomer } from "../../api/business";

const settings = {
  infinite: true,
  speed: 500,
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

const ExploreByOrganizer = () => {
  const sliderRef = useRef();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useAllBusinessesForCustomer((res) => {
    setData(res?.businesses);
  });

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
          <PrimaryButton
            onClick={() => navigate("/all-businesses")}
            className="explore-all-organizers"
          >
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
          {data.map((event, index) => {
            return (
              <div key={index} className="single-slider-item">
                <div className="gallery-item-container">
                  <img
                    src={event?.organizerImageBanner || "/images/event-1.jpg"}
                    alt={event?.company?.companyName}
                  />
                  <Link to={`/business-profile/${event?._id}`}>
                    <div className="organizer-tag">
                      <img
                        src={event?.organizerImage || "/images/event-1.jpg"}
                        alt={event?.company?.companyName}
                      />
                      <h5>{event?.company?.companyName}</h5>
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
