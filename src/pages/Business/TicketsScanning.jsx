import React from "react";
import "./TicketsScanning.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import EventsList from "../../components/Common/EventsList";
import SecondaryButton from "../../components/UI/SecondaryButton";
import { ReactSVG } from "react-svg";
import StatCard from "../../components/Common/StatCard";
import Chart from "../../components/Common/Chart";
import TopReferrersTable from "../../components/Tables/TopReferrersTable";
import { useState, useEffect } from "react";
import CountriesRevenueTable from "../../components/Tables/CountriesRevenueTable";
import EventAnalyticsTable from "../../components/Tables/EventAnalyticsTable";
import AddNewEventModal from "../../components/ManageEvents/AddNewEventModal";
import TicketsTableInScanning from "../../components/Tables/TicketsTableInScanning";
import GuestsTableInScanning from "../../components/Tables/GuestsTableInScanning";

const TicketsScanning = () => {
  const [tickets, setTickets] = useState([]);
  const [guests, setGuests] = useState([]);
  const [showAddNewEventModal, setShowAddNewEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const array = [];
    for (let i = 0; i < 30; i++) {
      const row = {
        key: i,
        ticketType: "Luxury Tickets",
        soldQuantity: "2322",
        admitedQuantity: "1290",
      };
      array.push(row);
    }
    setTickets(array);
  }, []);

  useEffect(() => {
    const array = [];
    for (let i = 0; i < 30; i++) {
      const row = {
        key: i,
        guestType: "Luxury Tickets",
        guestNumber: "23480",
        admittedGuest: "23480",
      };
      array.push(row);
    }
    setGuests(array);
  }, []);

  return (
    <>
      <Topbar
        title={"Ticket Scanning"}
        subtitle={"Manage your Tickets with Overview and Analytics"}
      />
      <div className="tickets-scanning-page-container">
        <EventsList
          showHeader={true}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
        <div className="stats-cards-header-container">
          <h3>Overview</h3>
          <div className="event-page-actions">
            <SecondaryButton onClick={() => {}}>
              <ReactSVG src="/icons/tools/scan-ticket.svg" />
              <span>Scan ticket & Admit guests</span>
            </SecondaryButton>
            <SecondaryButton onClick={() => {}}>
              <ReactSVG src="/icons/tools/plus-person.svg" />
              <span>Add new Guestlist</span>
            </SecondaryButton>
            <SecondaryButton onClick={() => {}}>
              <ReactSVG src="/icons/tools/ticket-outlined.svg" />
              <span>Add new Ticket</span>
            </SecondaryButton>
          </div>
        </div>
        <div className="stats-cards-container">
          <StatCard
            title={"Total Tickets"}
            number={62571}
            icon={<ReactSVG src="/icons/tools/ticket-filled-colored.svg" />}
            variant={"yellow-stat-card"}
          />
          <StatCard
            title={"Tickets Scanned"}
            number={345}
            icon={<ReactSVG src="/icons/tools/scan-ticket-colored.svg" />}
            variant={"green-stat-card"}
          />
          <StatCard
            title={"Total Guests"}
            number={8186}
            icon={<ReactSVG src="/icons/tools/people-list-colored.svg" />}
            variant={"blue-stat-card"}
          />
          <StatCard
            title={"Total Guests"}
            number={1102}
            icon={<ReactSVG src="/icons/tools/tick-person-colored.svg" />}
            variant={"orange-stat-card"}
          />
        </div>
        <div className="order-analytics-chart-container">
          <div className="container-header">
            <h3>Tickets Analytics</h3>
          </div>
          <Chart height={290} />
        </div>
        <div className="all-tables-main-container">
          <div className="table-container">
            <div className="table-container-header">
              <h3>Tickets</h3>
              <div className="search-container">
                <ReactSVG src="/icons/tools/search.svg" />
                <input type="text" name="search" placeholder="Search tickets" />
              </div>
            </div>
            <TicketsTableInScanning ticketsData={tickets} />
          </div>
          <div className="table-container">
            <div className="table-container-header">
              <h3>Guests</h3>
              <div className="search-container">
                <ReactSVG src="/icons/tools/search.svg" />
                <input type="text" name="search" placeholder="Search guests" />
              </div>
            </div>
            <GuestsTableInScanning guestsData={guests} />
          </div>
        </div>
      </div>
      <AddNewEventModal
        showAddNewEventModal={showAddNewEventModal}
        setShowAddNewEventModal={setShowAddNewEventModal}
      />
    </>
  );
};

export default TicketsScanning;
