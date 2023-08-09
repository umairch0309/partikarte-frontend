import React from "react";
import "./ManageEvents.scss";
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

const ManageEvents = () => {
  const [referrers, setReferrers] = useState([]);
  const [countriesRevenues, setCountriesRevenues] = useState([]);
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    const array = [];
    for (let i = 0; i < 5; i++) {
      const row = {
        key: i,
        name: "John",
        revenueGenerated: "23480",
      };
      array.push(row);
    }
    setReferrers(array);
  }, []);

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
        <EventsList showHeader={true} showInputs={true} />
        <div className="event-page-actions">
          <SecondaryButton onClick={() => {}}>
            <ReactSVG src="/icons/tools/people-list.svg" />
            <span>Add People to Guest List</span>
          </SecondaryButton>
          <SecondaryButton onClick={() => {}}>
            <ReactSVG src="/icons/tools/ticket-outlined.svg" />
            <span>Manage tickets</span>
          </SecondaryButton>
          <select name="timeframe">
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
            title={"Number of guests"}
            number={345}
            icon={<ReactSVG src="/icons/tools/people-list-colored.svg" />}
            variant={"blue-stat-card"}
            showCalendar={true}
          />
          <StatCard
            title={"Revenue generated"}
            number={"$" + 8186}
            icon={<ReactSVG src="/icons/tools/dollar-filled-colored.svg" />}
            variant={"green-stat-card"}
            showCalendar={true}
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
              <h3>Top referrers</h3>
            </div>
            <TopReferrersTable referrersData={referrers} />
          </div>
          <div className="table-container">
            <div className="table-container-header">
              <h3>Cities/Countries</h3>
            </div>
            <CountriesRevenueTable countriesData={countriesRevenues} />
          </div>
          <div className="table-container">
            <div className="table-container-header">
              <h3>Analytics</h3>
            </div>
            <EventAnalyticsTable analyticsData={analytics} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageEvents;
