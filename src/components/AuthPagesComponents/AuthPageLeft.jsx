import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { ReactSVG } from "react-svg";
import "./AuthPageLeft.scss";

const AuthPageLeft = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
  };
  const reviews = [
    {
      title: "Explore Best and Top Events on Partikarte!",
      description:
        "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.",
    },
    {
      title: "Join the Excitement at Partikarte!",
      description:
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    },
    {
      title: "Get Ready for Unforgettable Events!",
      description:
        "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore.",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="auth-page-left">
      <img src="/images/policies-banner.jpg" alt="banner" />
      <div className="left-content">
        <ReactSVG onClick={() => navigate("/")} src="/logo-white.svg" />
        <div className="featured-content-main">
          <Slider {...settings}>
            {reviews.map((review, index) => (
              <div key={index} className="single-slider-item">
                <div className="single-item">
                  <h1>{review.title}</h1>
                  <p>{review.description}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default AuthPageLeft;
