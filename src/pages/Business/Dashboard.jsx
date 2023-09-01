import React, { useEffect, useState } from "react";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import "./Dashboard.scss";
import Chart from "../../components/Common/Chart";
import OrdersTable from "../../components/Tables/OrdersTable";
import {
  useBusinessRevenueByMonth,
  useLatestOrders,
  useOrdersByTimeInterval,
} from "../../api/orders";
import { useActiveEvents, useAllEvents } from "../../api/manage-events";
import formatDate from "../../utilities/formatDate";
import { Skeleton } from "antd";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [ordersData, setOrdersData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [ordersDataForChart, setOrdersDataForChart] = useState([]);
  const [allEventsData, setAllEventsData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState("weekly");
  const [orderFilter, setOrderFilter] = useState("latest");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("January");

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

  const { isLoading: isRevenueDataLoading, response: revenueData } =
    useBusinessRevenueByMonth(selectedMonth);

  const { isLoading } = useLatestOrders((res) => {
    setOrdersData(res?.orders);
  });

  const { isLoading: isEventsLoading } = useActiveEvents((res) => {
    setEventsData(res?.events);
  });

  useEffect(() => {
    // Filter and sort ordersData based on the selected orderFilter
    let filteredAndSortedOrders = [...ordersData];

    if (orderFilter === "last-month") {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      filteredAndSortedOrders = filteredAndSortedOrders.filter(
        (order) => new Date(order.updatedAt) >= lastMonth
      );
    } else if (orderFilter === "last-week") {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      filteredAndSortedOrders = filteredAndSortedOrders.filter(
        (order) => new Date(order.updatedAt) >= lastWeek
      );
    }

    // Sort orders by updatedAt in descending order
    filteredAndSortedOrders.sort(
      (a, b) =>
        new Date(b.updatedAt)?.getTime() - new Date(a.updatedAt)?.getTime()
    );

    setFilteredOrders(filteredAndSortedOrders);
  }, [ordersData, orderFilter]);

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
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  <option value={""}>Choose event</option>
                  {allEventsData?.length > 0 &&
                    allEventsData?.map((el) => (
                      <option value={el?._id}>{el?.eventName}</option>
                    ))}
                </select>
                <select
                  value={selectedInterval}
                  onChange={(e) => setSelectedInterval(e.target.value)}
                >
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
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                >
                  <option value={"latest"}>Latest</option>
                  <option value={"last-month"}>Last month</option>
                  <option value={"last-week"}>Last week</option>
                </select>
              </div>
            </div>
            <OrdersTable isLoading={isLoading} ordersData={filteredOrders} />
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
                        <button
                          onClick={() =>
                            navigate(`/business/view-event/${event?._id}`)
                          }
                        >
                          More
                        </button>
                        <p>{formatDate(event.eventStart)}</p>
                      </div>
                      <hr />
                      <div className="revenue-details-container">
                        <p>Total Revenue:</p>
                        <h3>
                          ${event?.revenue}{" "}
                          <span>({event?.ticketsSold} tickets )</span>
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
              <select
                onChange={(e) => setSelectedMonth(e.target.value)}
                defaultValue={"January"}
              >
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>
            <div className="all-balance-sheets-container">
              <div className="single-balance-sheet">
                <h4>Total Orders</h4>
                <h3>{revenueData?.[0]?.totalOrders || 0}</h3>
              </div>
              <div className="single-balance-sheet">
                <h4>Balance</h4>
                <h3>${revenueData?.[0]?.totalRevenue || 0}</h3>
              </div>
              <div className="single-balance-sheet">
                <h4>Fee’s</h4>
                <h3>
                  ${parseInt(revenueData?.[0]?.totalRevenue) * 0.08 || 0} (8%)
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
