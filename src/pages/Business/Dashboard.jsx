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
import { useNavigate, useSearchParams } from "react-router-dom";
import usePermissionCheck from "../../hooks/usePermissionCheck";
import currencySymbolGenerator from "../../utilities/currencySymbolGenerator";
import { ShowMessageSuccess } from "../../hooks/ShowMessage";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { checkPermission } = usePermissionCheck();

  const [ordersData, setOrdersData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [ordersDataForChart, setOrdersDataForChart] = useState([]);
  const [allEventsData, setAllEventsData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("undefined");
  const [selectedEventForOrders, setSelectedEventForOrders] =
    useState("undefined");
  const [selectedInterval, setSelectedInterval] = useState("weekly");
  const [orderFilter, setOrderFilter] = useState("latest");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    monthNames[new Date().getMonth()]
  );

  useEffect(() => {
    if (searchParams.get("payment") !== "success") return;

    const sessionId = searchParams.get("session_id") || "success";
    const toastKey = `payment-success:${sessionId}`;

    // React Strict Mode remounts effects once — only show the toast a single time.
    if (!sessionStorage.getItem(toastKey)) {
      sessionStorage.setItem(toastKey, "1");
      ShowMessageSuccess(
        "Payment successful. Ticket order completed.",
        toastKey
      );
    }

    const next = new URLSearchParams(searchParams);
    next.delete("payment");
    next.delete("session_id");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const { isLoading: isAllEventsLoading } = useAllEvents((res) => {
    setAllEventsData(res?.events || []);
  });

  const { isLoading: isOrderChartDataLoading } = useOrdersByTimeInterval(
    [selectedInterval, selectedEvent],
    `${selectedInterval}${
      selectedEvent ? `?eventId=${selectedEvent}` : "undefined"
    }`,
    (res) => {
      console.log(res);
      setOrdersDataForChart(res?.orders || []);
    }
  );

  const { isLoading: isRevenueDataLoading, response: revenueData } =
    useBusinessRevenueByMonth(selectedMonth);

  const revenueSummary = Array.isArray(revenueData)
    ? revenueData[0]
    : revenueData;

  const formatEurAmount = (value, withDecimals = false) => {
    const amount = Number(value ?? 0);
    const formatted = withDecimals ? amount.toFixed(2) : amount;
    return `${currencySymbolGenerator("EUR")}${formatted}`;
  };

  const { isLoading } = useLatestOrders((res) => {
    setOrdersData(res?.orders || []);
  });

  const { isLoading: isEventsLoading } = useActiveEvents((res) => {
    setEventsData(res?.events || []);
  });

  useEffect(() => {
    // Filter and sort ordersData based on the selected orderFilter
    let filteredAndSortedOrders = [...ordersData];

    if (orderFilter === "last-month") {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      filteredAndSortedOrders = filteredAndSortedOrders.filter((order) =>
        new Date(order.updatedAt) >= lastMonth &&
        selectedEventForOrders === "undefined"
          ? 1
          : order.eventId?._id === selectedEventForOrders
      );
    } else if (orderFilter === "last-week") {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      filteredAndSortedOrders = filteredAndSortedOrders.filter((order) =>
        new Date(order.updatedAt) >= lastWeek &&
        selectedEventForOrders === "undefined"
          ? 1
          : order.eventId?._id === selectedEventForOrders
      );
    }

    // Sort orders by updatedAt in descending order
    filteredAndSortedOrders.sort(
      (a, b) =>
        new Date(b.updatedAt)?.getTime() - new Date(a.updatedAt)?.getTime()
    );

    setFilteredOrders(
      filteredAndSortedOrders?.filter((order) =>
        selectedEventForOrders === "undefined"
          ? true
          : order.eventId?._id === selectedEventForOrders
      )
    );
  }, [ordersData, orderFilter, selectedEventForOrders]);

  return (
    <>
      <Topbar title={"Welcome to Partikarte"} />
      <div className="dashboard-page-container">
        <div className="dashboard-page-left">
          {checkPermission("dashboardTicketSaleGraph").status && (
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
                    <option value={"undefined"}>All Events</option>
                    {allEventsData?.length > 0 &&
                      allEventsData?.map((el) => (
                        <option value={el?._id}>{el?.eventName}</option>
                      ))}
                  </select>
                  <select
                    value={selectedInterval}
                    onChange={(e) => setSelectedInterval(e.target.value)}
                  >
                    <option value={"daily"}>Today</option>
                    <option value={"weekly"}>Weekly</option>
                    <option value={"monthly"}>Monthly</option>
                    <option value={"yearly"}>Yearly</option>
                  </select>
                </div>
              </div>
              <Chart
                selectedInterval={selectedInterval}
                data={ordersDataForChart}
                height={290}
                currency="EUR"
              />
            </div>
          )}
          {checkPermission("dashboardLatestOrders").status && (
            <div className="latest-orders-container">
              <div className="latest-orders-container-header">
                <div className="header-left">
                  <h3>Latest orders</h3>
                </div>
                <div className="header-right">
                  <select
                    value={selectedEventForOrders}
                    onChange={(e) => setSelectedEventForOrders(e.target.value)}
                  >
                    <option value={""}>Choose event</option>
                    <option value={"undefined"}>All Events</option>
                    {allEventsData?.length > 0 &&
                      allEventsData?.map((el) => (
                        <option value={el?._id}>{el?.eventName}</option>
                      ))}
                  </select>
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
          )}
        </div>
        <div className="dashboard-page-right">
          {checkPermission("dashboardBalanceSheet").status && (
            <div className="balance-sheet-container">
              <div className="balance-sheet-header">
                <h3>Balance Sheet</h3>
                <select
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  value={selectedMonth}
                >
                  {monthNames.map((m) => (
                    <option value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="all-balance-sheets-container">
                <div className="single-balance-sheet">
                  <h4>Total Orders</h4>
                  <h3>{revenueSummary?.totalOrders || 0}</h3>
                </div>
                <div className="single-balance-sheet">
                  <h4>Revenue</h4>
                  <h3>{formatEurAmount(revenueSummary?.totalRevenue)}</h3>
                </div>
                <div className="single-balance-sheet">
                  <h4>Fee’s</h4>
                  <h3>
                    {formatEurAmount(revenueSummary?.totalPlatformFees, true)}{" "}
                    (8%)
                  </h3>
                </div>
              </div>
            </div>
          )}

          {checkPermission("dashboardActiveEvents").status && (
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
                            {currencySymbolGenerator(event?.eventCurrency)}
                            {event?.revenue}{" "}
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
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
