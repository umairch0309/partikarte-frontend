import React from "react";
import HeaderPlaceHolder from "../../components/Layouts/UserLayout/HeaderPlaceHolder";
import TopSearch from "../../components/UserLandingPagesSections/TopSearch";
import FeaturedEvents from "../../components/UserLandingPagesSections/FeaturedEvents";

import "./LandingPage.scss";
import AllEvents from "../../components/UserLandingPagesSections/AllEvents";
import ExploreByOrganizer from "../../components/UserLandingPagesSections/ExploreByOrganizer";

const LandingPage = () => {
  return (
    <div className="landing-page-user">
      <HeaderPlaceHolder />
      <TopSearch />
      <FeaturedEvents
        titleStart="Featured"
        titleEnd="Events"
        status="Featured!"
      />
      <hr />
      <AllEvents link={"/all-events"} />
      <ExploreByOrganizer />
    </div>
  );
};

export default LandingPage;
