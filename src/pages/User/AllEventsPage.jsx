import React, { useState } from "react";
import HeaderPlaceHolder from "../../components/Layouts/UserLayout/HeaderPlaceHolder";
import TopSearch from "../../components/UserLandingPagesSections/TopSearch";
import "./AllEventsPage.scss";
import AllEvents from "../../components/UserLandingPagesSections/AllEvents";
import ExploreByOrganizer from "../../components/UserLandingPagesSections/ExploreByOrganizer";

const AllEventsPage = () => {
  const [searchText, setSearchText] = useState("");
  const [interval, setInterval] = useState("All");
  return (
    <div className="all-events-page-user">
      <HeaderPlaceHolder />
      <TopSearch setSearchText={setSearchText} setInterval={setInterval} />
      <AllEvents searchText={searchText} interval={interval} />
      <ExploreByOrganizer />
    </div>
  );
};

export default AllEventsPage;
