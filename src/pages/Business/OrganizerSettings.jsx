import React, { useState } from "react";
import { Link, NavLink, useLocation, Route, Routes } from "react-router-dom";
import { ReactSVG } from "react-svg";
import "./OrganizerSettings.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import Galleries from "../../components/OrganizerSettings/Main/Galleries";
import ViewGallery from "../../components/OrganizerSettings/Main/ViewGallery";
import News from "../../components/OrganizerSettings/Main/News";
import Company from "../../components/OrganizerSettings/Main/Company";
import CustomizeTickets from "../../components/OrganizerSettings/Main/CustomizeTickets";
import TicketCustomizationForm from "../../components/OrganizerSettings/Main/TicketCustomizationForm";
import usePermissionCheck from "../../hooks/usePermissionCheck";

const OrganizerSettings = () => {
  const location = useLocation();
  const { checkPermission } = usePermissionCheck();
  const [selectedTicket, setSelectedTicket] = useState(null);
  return (
    <>
      <Topbar
        title={"Organizer"}
        subtitle={"Setup Organizers information to make it updated."}
      />
      <div className="organizer-settings-main-container">
        <div className="organizer-settings-menu">
          {checkPermission("galleryManagement").status && (
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
          )}
          {checkPermission("news").status && (
            <NavLink to={"./news"}>
              <ReactSVG src="/icons/menu/news.svg" />
              <span>News</span>
            </NavLink>
          )}
          {checkPermission("companyDetails").status && (
            <NavLink to={"./company-details"}>
              <ReactSVG src="/icons/menu/user-square.svg" />
              <span>Organizer Details</span>
            </NavLink>
          )}
          {checkPermission("ticketCustomization").status && (
            <NavLink to={"./tickets-customization"}>
              <ReactSVG src="/icons/menu/ticket-outlined.svg" />
              <span>Customize Tickets</span>
            </NavLink>
          )}
        </div>

        <div className="organizer-settings-main-bottom">
          <Routes>
            {checkPermission("galleryManagement").status && (
              <Route index element={<Galleries />} />
            )}
            {checkPermission("news").status && (
              <Route path="/news" element={<News />} />
            )}
            {checkPermission("companyDetails").status && (
              <Route path="/company-details" element={<Company />} />
            )}
            {checkPermission("ticketCustomization").status && (
              <Route
                path="/tickets-customization"
                element={
                  <CustomizeTickets setSelectedTicket={setSelectedTicket} />
                }
              />
            )}
            {checkPermission("ticketCustomization").status && (
              <Route
                path="/tickets-customization/form"
                element={
                  <TicketCustomizationForm selectedTicket={selectedTicket} />
                }
              />
            )}

            {/* SUB ROUTES  */}
            {checkPermission("galleryManagement").status && (
              <Route path="/galleries/:galleryId" element={<ViewGallery />} />
            )}
          </Routes>
        </div>
      </div>
    </>
  );
};

export default OrganizerSettings;
