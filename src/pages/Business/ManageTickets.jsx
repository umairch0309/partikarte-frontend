import React, { useState, useEffect } from "react";
import { ReactSVG } from "react-svg";
import "./ManageTickets.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import EventsList from "../../components/Common/EventsList";
import StatCard from "../../components/Common/StatCard";
import Chart from "../../components/Common/Chart";
import SecondaryButton from "../../components/UI/SecondaryButton";
import TicketsTable from "../../components/Tables/TicketsTable";
import NewTicketModal from "../../components/ManageTickets/NewTicketModal";

const ManageTickets = () => {
  const [data, setData] = useState([]);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const array = [];
    for (let i = 0; i < 100; i++) {
      const row = {
        key: i,
        ticketName: `Red line Folded Front Seats`,
        ticketType: "Party Tickets",
        availability: "24 Jan, 2023  to 24 April, 2023",
        numberOfTicketsOrdered: Math.floor(Math.random() * 10),
        remainingTickets: Math.floor(Math.random() * 50),
        revenueGenerated: `$${Math.floor(Math.random() * 1000)}`,
      };
      array.push(row);
    }
    setData(array);
  }, []);
  return (
    <>
      <Topbar
        title={"Tickets Management"}
        subtitle={"Manage your Tickets with Overview and Analytics"}
      />
      <div className="manage-tickets-page-container">
        <EventsList
          showHeader={true}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
        <div className="tickets-page-actions">
          <h3>Overview</h3>
          <select name="timeframe">
            <option value={"all-time"}>All Time</option>
            <option value={"monthly"}>Monthly</option>
            <option value={"weekly"}>Weekly</option>
            <option value={"yearly"}>Yearly</option>
          </select>
        </div>
        <div className="stats-cards-container">
          <StatCard
            title={"Tickets sold"}
            number={186}
            icon={<ReactSVG src="/icons/tools/ticket-filled-colored.svg" />}
            variant={"yellow-stat-card"}
            showCalendar={true}
          />
          <StatCard
            title={"Revenue generated"}
            number={"$" + "23,186"}
            icon={<ReactSVG src="/icons/tools/dollar-filled-colored.svg" />}
            variant={"green-stat-card"}
            showCalendar={true}
          />
        </div>
        <div className="table-container">
          <div className="table-container-header">
            <h3>Tickets</h3>
            <div className="header-right">
              <div className="search-container">
                <ReactSVG src="/icons/tools/search.svg" />
                <input type="text" name="search" placeholder="Search tickets" />
              </div>
              <SecondaryButton
                onClick={() => {
                  setShowNewTicketModal(true);
                }}
              >
                <ReactSVG src="/icons/tools/ticket-outlined.svg" />
                <span>Create tickets</span>
              </SecondaryButton>
            </div>
          </div>
          <TicketsTable ticketsData={data} />
        </div>
      </div>
      <NewTicketModal
        showNewTicketModal={showNewTicketModal}
        setShowNewTicketModal={setShowNewTicketModal}
      />
    </>
  );
};

export default ManageTickets;
