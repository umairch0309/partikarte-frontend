import React from "react";
import { Link, NavLink, useLocation, Route, Routes } from "react-router-dom";
import { ReactSVG } from "react-svg";
import "./OrganizerSettings.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import Galleries from "../../components/OrganizerSettings/Main/Galleries";
import ViewGallery from "../../components/OrganizerSettings/Main/ViewGallery";
import News from "../../components/OrganizerSettings/Main/News";
import Company from "../../components/OrganizerSettings/Main/Company";
import CustomizeTickets from "../../components/OrganizerSettings/Main/CustomizeTickets";

const OrganizerSettings = () => {
  const location = useLocation();
  return (
    <>
      <Topbar
        title={"Organizer"}
        subtitle={"Setup Organizers information to make it updated."}
      />
      <div className="organizer-settings-main-container">
        <div className="organizer-settings-menu">
          <Link
            to={"./"}
            className={
              location.pathname === "/business/organizer-settings" ||
              location.pathname === "/business/organizer-settings/" ||
              location.pathname.startsWith(
                "/business/organizer-settings/galleries"
              )
                ? "active"
                : ""
            }
          >
            <ReactSVG src="/icons/menu/gallery.svg" />
            <span>Galleries</span>
          </Link>
          <NavLink to={"./news"}>
            <ReactSVG src="/icons/menu/news.svg" />
            <span>News</span>
          </NavLink>
          <NavLink to={"./company-details"}>
            <ReactSVG src="/icons/menu/user-square.svg" />
            <span>Company Details</span>
          </NavLink>
          <NavLink to={"./tickets-customization"}>
            <ReactSVG src="/icons/menu/ticket-outlined.svg" />
            <span>Customize Tickets</span>
          </NavLink>
        </div>

        <div className="organizer-settings-main-bottom">
          <Routes>
            <Route index element={<Galleries />} />
            <Route path="/news" element={<News />} />
            <Route path="/company-details" element={<Company />} />
            <Route
              path="/tickets-customization"
              element={<CustomizeTickets />}
            />

            {/* SUB ROUTES  */}
            <Route path="/galleries/:galleryId" element={<ViewGallery />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default OrganizerSettings;
