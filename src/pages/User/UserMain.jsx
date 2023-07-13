import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLayout from "../../components/Layouts/UserLayout/UserLayout";
import Page404 from "../common/Page404";
import LandingPage from "./LandingPage";
import AllEventsPage from "./AllEventsPage";
import ViewEvent from "./ViewEvent";
import GoogleMapComponent from "../../components/service-components/GoogleMapComponent";

const UserMain = () => {
  return (
    <UserLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/all-events" element={<AllEventsPage />} />
        <Route path="/all-events/:eventId" element={<ViewEvent />} />
        <Route path="/google" element={<GoogleMapComponent />} />

        <Route path="*" element={<Page404 />} />
      </Routes>
    </UserLayout>
  );
};

export default UserMain;
