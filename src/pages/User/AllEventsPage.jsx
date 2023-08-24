import React from "react";
import HeaderPlaceHolder from "../../components/Layouts/UserLayout/HeaderPlaceHolder";
import TopSearch from "../../components/UserLandingPagesSections/TopSearch";
import "./AllEventsPage.scss";
import AllEvents from "../../components/UserLandingPagesSections/AllEvents";
import ExploreByOrganizer from "../../components/UserLandingPagesSections/ExploreByOrganizer";

const AllEventsPage = () => {
  return (
    <div className="all-events-page-user">
      <HeaderPlaceHolder />
      <TopSearch />
      <AllEvents />
      <ExploreByOrganizer />
    </div>
  );
};

export default AllEventsPage;
