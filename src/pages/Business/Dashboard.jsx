import React, { useEffect, useState } from "react";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import "./Dashboard.scss";
import Chart from "../../components/Common/Chart";
import OrdersTable from "../../components/Tables/OrdersTable";
import { useLatestOrders, useOrdersByTimeInterval } from "../../api/orders";
import { useActiveEvents, useAllEvents } from "../../api/manage-events";
import formatDate from "../../utilities/formatDate";
import { Skeleton } from "antd";

const Dashboard = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [ordersDataForChart, setOrdersDataForChart] = useState([]);
  const [allEventsData, setAllEventsData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState("weekly");

  const { isLoading: isAllEventsLoading } = useAllEvents((res) => {
    setAllEventsData(res?.events);
  });

  const { isLoading: isOrderChartDataLoading } = useOrdersByTimeInterval(
    [selectedInterval, selectedEvent],
    `${selectedInterval}${selectedEvent ? `?eventId=${selectedEvent}` : ""}`,
    (res) => {
      console.log(res);
      setOrdersDataForChart(res?.orders);
    }
  );

  const { isLoading } = useLatestOrders((res) => {
    setOrdersData(res?.orders);
  });

  const { isLoading: isEventsLoading } = useActiveEvents((res) => {
    setEventsData(res?.events);
  });

  return (
    <>
      <Topbar
        title={"Welcome to Partikarte"}
        subtitle={"Hey David, Good Evening 🌃"}
      />
      <div className="dashboard-page-container">
        <div className="dashboard-page-left">
          <div className="chart-main-container">
            <div className="chart-container-header">
              <div className="header-left">
                <h3>Ticket sales graph</h3>
              </div>
              <div className="header-right">
                <select onChange={(e) => setSelectedEvent(e.target.value)}>
                  <option value={""}>Choose event</option>
                  {allEventsData?.length > 0 &&
                    allEventsData?.map((el) => (
                      <option value={el?._id}>{el?.eventName}</option>
                    ))}
                </select>
                {/* <select>
                  <option>Ticket type</option>
                  <option value={"VIP"}>VIP</option>
                  <option value={"VIP"}>VVIP</option>
                  <option value={"VIP"}>Economy</option>
                </select> */}
                <select onChange={(e) => setSelectedInterval(e.target.value)}>
                  <option value={"monthly"}>Monthly</option>
                  <option value={"yearly"}>Yearly</option>
                  <option value={"weekly"}>Weekly</option>
                </select>
              </div>
            </div>
            <Chart
              selectedInterval={selectedInterval}
              data={ordersDataForChart}
              height={290}
            />
          </div>
          <div className="latest-orders-container">
            <div className="latest-orders-container-header">
              <div className="header-left">
                <h3>Latest orders</h3>
              </div>
              <div className="header-right">
                <select>
                  <option value={"latest"}>Latest</option>
                  <option value={"last-month"}>Last month</option>
                  <option value={"last-week"}>Last week</option>
                </select>
              </div>
            </div>
            <OrdersTable isLoading={isLoading} ordersData={ordersData} />
          </div>
        </div>
        <div className="dashboard-page-right">
          <div className="active-events-container">
            <h3>Active Events</h3>
            <div className="all-active-events-container">
              {!isEventsLoading ? (
                eventsData?.length > 0 ? (
                  eventsData?.map((event, index) => (
                    <div className="single-active-event" key={index}>
                      <h5>{event?.eventName}</h5>
                      <h6>{event?.eventDescription}</h6>
                      <div className="more-button-container">
                        <button>More</button>
                        <p>{formatDate(event.eventStart)}</p>
                      </div>
                      <hr />
                      <div className="revenue-details-container">
                        <p>Total Revenue Generated:</p>
                        <h3>
                          {event?.revenue} <span>({event?.ticketsSold})</span>
                        </h3>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No active events</p>
                )
              ) : (
                <Skeleton active={true} size={"small"} />
              )}
            </div>
          </div>
          <div className="balance-sheet-container">
            <div className="balance-sheet-header">
              <h3>Balance Sheet</h3>
              <select defaultValue={"january"}>
                <option value="january">January</option>
                <option value="february">February</option>
                <option value="march">March</option>
                <option value="april">April</option>
                <option value="may">May</option>
                <option value="june">June</option>
                <option value="july">July</option>
                <option value="august">August</option>
                <option value="september">September</option>
                <option value="october">October</option>
                <option value="november">November</option>
                <option value="december">December</option>
              </select>
            </div>
            <div className="all-balance-sheets-container">
              <div className="single-balance-sheet">
                <h4>Total Orders</h4>
                <h3>293</h3>
              </div>
              <div className="single-balance-sheet">
                <h4>Payout to Bank</h4>
                <h3>$234,961.67</h3>
              </div>
              <div className="single-balance-sheet">
                <h4>Fee’s</h4>
                <h3>$1140 (0.5%)</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
