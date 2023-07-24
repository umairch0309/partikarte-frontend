import React, { useRef } from "react";
import "./Reviews.scss";
import { ReactSVG } from "react-svg";
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

const reviewsData = [
  {
    id: 1,
    date: "March 1, 2021",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    image: "/images/event-1.jpg",
    name: "Karan Asix",
    organization: "Kulturni zavod",
  },
  {
    id: 1,
    date: "March 1, 2021",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    image: "/images/event-1.jpg",
    name: "Karan Asix",
    organization: "Kulturni zavod",
  },
  {
    id: 1,
    date: "March 1, 2021",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    image: "/images/event-1.jpg",
    name: "Karan Asix",
    organization: "Kulturni zavod",
  },
  {
    id: 1,
    date: "March 1, 2021",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    image: "/images/event-1.jpg",
    name: "Karan Asix",
    organization: "Kulturni zavod",
  },
];

const Reviews = () => {
  const sliderRef = useRef();

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h1>What our Customer Says About Partikarte.</h1>
        <p>
          Most of our users give us feedback regarding our services. You can see
          their comments on bellow, Follow their fun by joining the other
          members soon!
        </p>
        <div className="header-right">
          <ReactSVG
            onClick={() => sliderRef.current.slickPrev()}
            className="reviews-header-arrow arrow-left"
            src="/icons/tools/arrow-head-left.svg"
          />
          <ReactSVG
            onClick={() => sliderRef.current.slickNext()}
            className="reviews-header-arrow arrow-right"
            src="/icons/tools/arrow-head-right.svg"
          />
        </div>
      </div>
      <div className="reviews-main">
        <Slider {...settings} ref={sliderRef}>
          {reviewsData.map((review) => (
            <div key={review.id} className="single-slider-item">
              <div className="single-review-item">
                <div className="review-item-header">
                  <ReactSVG src="/icons/tools/qoutes.svg" />
                  <h5>Original review: {review.date}</h5>
                </div>
                <p>{review.content}</p>
                <hr />
                <div className="review-item-footer">
                  <div className="review-item-footer-left">
                    <img src={review.image} alt="name" />
                    <h4>{review.name}</h4>
                  </div>
                  <a href="#">{review.organization}</a>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Reviews;
