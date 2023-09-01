import React from "react";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import ViewSingleEvent from "../../components/Common/ViewSingleEvent";

const ViewEventBusiness = () => {
  return (
    <>
      <Topbar title={"Event Details"} subtitle={"View the event details."} />
      <ViewSingleEvent />
    </>
  );
};

export default ViewEventBusiness;
