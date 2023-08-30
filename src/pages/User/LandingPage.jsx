import React, { useState } from "react";
import HeaderPlaceHolder from "../../components/Layouts/UserLayout/HeaderPlaceHolder";
import TopSearch from "../../components/UserLandingPagesSections/TopSearch";
import FeaturedEvents from "../../components/UserLandingPagesSections/FeaturedEvents";

import "./LandingPage.scss";
import AllEvents from "../../components/UserLandingPagesSections/AllEvents";
import ExploreByOrganizer from "../../components/UserLandingPagesSections/ExploreByOrganizer";

const LandingPage = () => {
  const [searchText, setSearchText] = useState("");
  const [interval, setInterval] = useState("All");

  return (
    <div className="landing-page-user">
      <HeaderPlaceHolder />
      <TopSearch setSearchText={setSearchText} setInterval={setInterval} />
      <FeaturedEvents
        titleStart="Featured"
        titleEnd="Events"
        status="Featured!"
      />
      <hr />
      <AllEvents
        searchText={searchText}
        interval={interval}
        link={"/all-events"}
      />
      <ExploreByOrganizer />
    </div>
  );
};

export default LandingPage;
