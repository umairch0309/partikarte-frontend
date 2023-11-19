import React from "react";
import "./TicketsScanning.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import EventsList from "../../components/Common/EventsList";
import SecondaryButton from "../../components/UI/SecondaryButton";
import { ReactSVG } from "react-svg";
import StatCard from "../../components/Common/StatCard";
import Chart from "../../components/Common/Chart";
import { useState, useEffect } from "react";
import AddNewEventModal from "../../components/ManageEvents/AddNewEventModal";
import TicketsTableInScanning from "../../components/Tables/TicketsTableInScanning";
import GuestsTableInScanning from "../../components/Tables/GuestsTableInScanning";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import { useOrdersByTimeInterval } from "../../api/orders";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const TicketsScanning = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [guests, setGuests] = useState([]);
  const [showAddNewEventModal, setShowAddNewEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTable, setSelectedTable] = useState(0);
  const isMobile = useIsMobileWidth();

  const [ordersDataForChart, setOrdersDataForChart] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState("monthly");

  const { isLoading: isOrderChartDataLoading } = useOrdersByTimeInterval(
    [selectedInterval, selectedEvent?._id],
    `${selectedInterval}${
      selectedEvent?._id ? `?eventId=${selectedEvent?._id}` : ""
    }`,
    (res) => {
      console.log(res);
      setOrdersDataForChart(res?.orders);
    }
  );

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

  const copyToClipboard = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Copied to clipboard.");
      })
      .catch((error) => {
        message.error("Couldn't copy to clipboard.");
      });
  };

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
            <SecondaryButton
              onClick={() => {
                navigate("/business/guestlists");
              }}
            >
              <ReactSVG src="/icons/tools/plus-person.svg" />
              <span>Manage Guestlists</span>
            </SecondaryButton>
            <SecondaryButton
              onClick={() => {
                navigate("/business/manage-tickets");
              }}
            >
              <ReactSVG src="/icons/tools/ticket-outlined.svg" />
              <span>Manage Tickets</span>
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
            title={"Guests Permitted"}
            number={1102}
            icon={<ReactSVG src="/icons/tools/tick-person-colored.svg" />}
            variant={"orange-stat-card"}
          />
        </div>
        <div className="event-code-container">
          <div className="container-header">
            <h3>Scanning Code</h3>
          </div>
          <div className="event-code-main">
            <div className="form-item">
              <div className="form-item copy-code">
                <input type="text" disabled value={selectedEvent?.eventCode} />
                <ReactSVG
                  className="copy-icon"
                  src="/icons/tools/copy.svg"
                  onClick={() => copyToClipboard(`${selectedEvent?.eventCode}`)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="order-analytics-chart-container">
          <div className="container-header">
            <h3>Tickets Analytics</h3>
            <select onChange={(e) => setSelectedInterval(e.target.value)}>
              <option value={"monthly"}>Monthly</option>
              <option value={"weekly"}>Weekly</option>
              <option value={"yearly"}>Yearly</option>
            </select>
          </div>
          <Chart
            selectedInterval={selectedInterval}
            data={ordersDataForChart}
            height={290}
          />
        </div>
        {isMobile && (
          <div className="tables-selection-buttons-container">
            <button
              className={selectedTable === 0 ? "selected-button" : ""}
              onClick={() => setSelectedTable(0)}
            >
              Tickets Table
            </button>
            <button
              className={selectedTable === 1 ? "selected-button" : ""}
              onClick={() => setSelectedTable(1)}
            >
              Guests Table
            </button>
          </div>
        )}
        <div className="all-tables-main-container">
          {!isMobile && (
            <div className="table-container">
              <div className="table-container-header">
                <h3>Tickets</h3>
                <div className="search-container">
                  <ReactSVG src="/icons/tools/search.svg" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Search tickets"
                  />
                </div>
              </div>
              <TicketsTableInScanning ticketsData={tickets} />
            </div>
          )}
          {isMobile && selectedTable === 0 && (
            <div className="table-container">
              <div className="table-container-header">
                <h3>Tickets</h3>
                <div className="search-container">
                  <ReactSVG src="/icons/tools/search.svg" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Search tickets"
                  />
                </div>
              </div>
              <TicketsTableInScanning ticketsData={tickets} />
            </div>
          )}
          {!isMobile && (
            <div className="table-container">
              <div className="table-container-header">
                <h3>Guests</h3>
                <div className="search-container">
                  <ReactSVG src="/icons/tools/search.svg" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Search guests"
                  />
                </div>
              </div>
              <GuestsTableInScanning guestsData={guests} />
            </div>
          )}
          {isMobile && selectedTable === 1 && (
            <div className="table-container">
              <div className="table-container-header">
                <h3>Guests</h3>
                <div className="search-container">
                  <ReactSVG src="/icons/tools/search.svg" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Search guests"
                  />
                </div>
              </div>
              <GuestsTableInScanning guestsData={guests} />
            </div>
          )}
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
