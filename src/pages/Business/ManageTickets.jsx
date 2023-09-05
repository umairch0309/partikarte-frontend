import React, { useState, useEffect } from "react";
import { ReactSVG } from "react-svg";
import "./ManageTickets.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import EventsList from "../../components/Common/EventsList";
import StatCard from "../../components/Common/StatCard";
import SecondaryButton from "../../components/UI/SecondaryButton";
import TicketsTable from "../../components/Tables/TicketsTable";
import NewTicketModal from "../../components/ManageTickets/NewTicketModal";

const ManageTickets = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [ticketEditStatus, setTicketEditStatus] = useState(false);
  const [searchedText, setSearchedText] = useState(false);

  useEffect(() => {
    if (selectedEvent) {
      setData(selectedEvent?.tickets);
      setFilteredData(selectedEvent?.tickets);
    }
  }, [selectedEvent]);

  useEffect(() => {
    filterData(searchedText);
  }, [searchedText]);

  const filterData = (text) => {
    const d = data.filter((t) =>
      JSON.stringify(t).toLowerCase().includes(text?.toLowerCase())
    );
    setFilteredData(d);
  };

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
            number={selectedEvent?.ticketsSold ? selectedEvent?.ticketsSold : 0}
            icon={<ReactSVG src="/icons/tools/ticket-filled-colored.svg" />}
            variant={"yellow-stat-card"}
            showCalendar={true}
          />
          <StatCard
            title={"Revenue generated"}
            number={"$" + (selectedEvent?.revenue || 0)}
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
                <input
                  type="text"
                  name="search"
                  placeholder="Search tickets"
                  onChange={(e) => setSearchedText(e.target.value)}
                />
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
          <TicketsTable
            setShowNewTicketModal={setShowNewTicketModal}
            ticketsData={filteredData}
            setTicketEditStatus={setTicketEditStatus}
            setSelectedTicket={setSelectedTicket}
            selectedTicket={selectedTicket}
            selectedEvent={selectedEvent}
          />
        </div>
      </div>
      <NewTicketModal
        showNewTicketModal={showNewTicketModal}
        setShowNewTicketModal={setShowNewTicketModal}
        selectedEvent={selectedEvent}
        setTicketEditStatus={setTicketEditStatus}
        ticketEditStatus={ticketEditStatus}
        selectedTicket={selectedTicket}
      />
    </>
  );
};

export default ManageTickets;
