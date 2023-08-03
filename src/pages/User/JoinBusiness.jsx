import React from "react";
import PrimaryButton from "../../components/UI/PrimaryButton";
import "./JoinBusiness.scss";
import BecomeAPartner from "../../components/UserLandingPagesSections/BecomeAPartner";
import Benefits from "../../components/UserLandingPagesSections/Benefits";
import FeeCompetition from "../../components/UserLandingPagesSections/FeeCompetition";
import UniqueFeatuers from "../../components/UserLandingPagesSections/UniqueFeatuers";
import Calculate from "../../components/UserLandingPagesSections/Calculate";
import Reviews from "../../components/UserLandingPagesSections/Reviews";
import { ReactSVG } from "react-svg";

const JoinBusiness = () => {
  return (
    <div className="join-business-page">
      <div className="join-business-hero-section">
        <img src="/images/background-style.svg" />
        <div className="content-on-image-top">
          <div>
            <h1>Supercharge your event organizing with Par.karte</h1>
            <h5>An AI powered event .cke.ng solu.on to improve your events</h5>
          </div>
          <PrimaryButton className={"become-a-partner-button"}>
            Become a Partner
          </PrimaryButton>
        </div>
      </div>
      <BecomeAPartner />
      <Benefits />
      <FeeCompetition />
      <UniqueFeatuers />
      <Calculate />
      <div className="image-div">
        <img className="image" src="/images/our-partners.png" />
      </div>

      <Reviews />
      <div className="join-us-footer-container">
        <img
          className="background-image"
          src="/images/circles-background.png"
        />
        <div className="join-us-footer-content">
          <h5>Join Partnerships</h5>
          <h1>Join us as Partikarte Partners!</h1>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever.
          </p>
          <PrimaryButton className={"become-our-partner"}>
            Become our Partner
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default JoinBusiness;
