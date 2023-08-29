import React from "react";
import "./ManageEvents.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import EventsList from "../../components/Common/EventsList";
import SecondaryButton from "../../components/UI/SecondaryButton";
import { ReactSVG } from "react-svg";
import StatCard from "../../components/Common/StatCard";
import Chart from "../../components/Common/Chart";
import { useState, useEffect } from "react";
import CountriesRevenueTable from "../../components/Tables/CountriesRevenueTable";
import EventAnalyticsTable from "../../components/Tables/EventAnalyticsTable";
import AddNewEventModal from "../../components/ManageEvents/AddNewEventModal";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import { useNavigate } from "react-router-dom";
import { useOrdersByTimeInterval } from "../../api/orders";

const ManageEvents = () => {
  const navigate = useNavigate();
  const [countriesRevenues, setCountriesRevenues] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [showAddNewEventModal, setShowAddNewEventModal] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState("weekly");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTable, setSelectedTable] = useState(0);
  const isMobile = useIsMobileWidth();

  const [ordersDataForChart, setOrdersDataForChart] = useState([]);
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
    for (let i = 0; i < 5; i++) {
      const row = {
        key: i,
        location: "Jordan",
        revenueGenerated: "23480",
      };
      array.push(row);
    }
    setCountriesRevenues(array);
  }, []);

  useEffect(() => {
    const array = [];
    for (let i = 0; i < 5; i++) {
      const row = {
        key: i,
        title: "Number of orders",
        values: "343 Orders",
      };
      array.push(row);
    }
    setAnalytics(array);
  }, []);

  return (
    <>
      <Topbar
        title={"Manage Events"}
        subtitle={"Manage your Events with Overview and Analytics"}
      />
      <div className="manage-events-page-container">
        <EventsList
          setShowAddNewEventModal={setShowAddNewEventModal}
          showHeader={true}
          showInputs={true}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
        <div className="event-page-actions">
          <SecondaryButton
            onClick={() => {
              navigate("/business/guestlists");
            }}
          >
            <ReactSVG src="/icons/tools/people-list.svg" />
            <span>Manage Guest Lists</span>
          </SecondaryButton>
          <SecondaryButton
            onClick={() => {
              navigate("/business/manage-tickets");
            }}
          >
            <ReactSVG src="/icons/tools/ticket-outlined.svg" />
            <span>Manage tickets</span>
          </SecondaryButton>
          <select
            name="timeframe"
            onChange={(e) => setSelectedInterval(e.target.value)}
          >
            <option value={"monthly"}>Monthly</option>
            <option value={"weekly"}>Weekly</option>
            <option value={"yearly"}>Yearly</option>
          </select>
        </div>
        <div className="stats-cards-container">
          <StatCard
            title={"Tickets sold"}
            number={selectedEvent?.ticketsSold || 0}
            icon={<ReactSVG src="/icons/tools/ticket-filled-colored.svg" />}
            variant={"yellow-stat-card"}
            showCalendar={true}
          />
          <StatCard
            title={"Number of guests"}
            number={selectedEvent?.ticketsSold || 0}
            icon={<ReactSVG src="/icons/tools/people-list-colored.svg" />}
            variant={"blue-stat-card"}
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
        <div className="order-analytics-chart-container">
          <div className="container-header">
            <h3>Tickets Analytics</h3>
          </div>
          <Chart
            data={ordersDataForChart}
            selectedInterval={selectedInterval}
            height={290}
          />
        </div>
        {isMobile && (
          <div className="tables-selection-buttons-container">
            <button
              className={selectedTable === 1 ? "selected-button" : ""}
              onClick={() => setSelectedTable(1)}
            >
              Cities/Countries
            </button>
            <button
              className={selectedTable === 2 ? "selected-button" : ""}
              onClick={() => setSelectedTable(2)}
            >
              Analytics
            </button>
          </div>
        )}
        <div className="all-tables-main-container">
          {!isMobile && (
            <div className="table-container">
              <div className="table-container-header">
                <h3>Cities/Countries</h3>
              </div>
              <CountriesRevenueTable countriesData={countriesRevenues} />
            </div>
          )}
          {isMobile && selectedTable === 1 && (
            <div className="table-container">
              <div className="table-container-header">
                <h3>Cities/Countries</h3>
              </div>
              <CountriesRevenueTable countriesData={countriesRevenues} />
            </div>
          )}
          {!isMobile && (
            <div className="table-container">
              <div className="table-container-header">
                <h3>Analytics</h3>
              </div>
              <EventAnalyticsTable analyticsData={analytics} />
            </div>
          )}
          {isMobile && selectedTable === 2 && (
            <div className="table-container">
              <div className="table-container-header">
                <h3>Analytics</h3>
              </div>
              <EventAnalyticsTable analyticsData={analytics} />
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

export default ManageEvents;
