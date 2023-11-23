import React from "react";
import "./Orders.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import EventsList from "../../components/Common/EventsList";
import SecondaryButton from "../../components/UI/SecondaryButton";
import { ReactSVG } from "react-svg";
import StatCard from "../../components/Common/StatCard";
import Chart from "../../components/Common/Chart";
import { useState, useEffect } from "react";
import CustomersTable from "../../components/Tables/CustomersTable";
import { useOrdersByEventId, useOrdersByTimeInterval } from "../../api/orders";
import { CSVLink } from "react-csv";
import { customers } from "../../utilities/csv-headers";
import usePermissionCheck from "../../hooks/usePermissionCheck";
import currencySymbolGenerator from "../../utilities/currencySymbolGenerator";

const Orders = () => {
  const { checkPermission } = usePermissionCheck();
  const [data, setData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState("weekly");
  const [filteredData, setFilteredData] = useState([]);
  const [interval, setInterval] = useState("weekly");
  const [searchText, setSearchText] = useState("");

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

  const { isLoading: isOrdersLoading } = useOrdersByEventId(
    selectedEvent?._id,
    (res) => {
      console.log(res);
      setData(res?.orders);
      setFilteredData(res?.orders);
    }
  );

  const handleSearchText = (text) => {
    applyFilters(text, interval);
    setSearchText(text);
  };

  const handleIntervalChange = (text) => {
    applyFilters(searchText, text);
    setInterval(text);
  };

  const applyFilters = (searchText, interval) => {
    let filtered = data;

    filtered = filtered.filter((guest) =>
      JSON.stringify(guest)?.toLowerCase()?.includes(searchText?.toLowerCase())
    );

    if (interval === "monthly") {
      const currentDate = new Date();
      filtered = filtered.filter((guest) => {
        const guestDate = new Date(guest.createdAt);
        return (
          guestDate.getFullYear() === currentDate.getFullYear() &&
          guestDate.getMonth() === currentDate.getMonth()
        );
      });
    } else if (interval === "weekly") {
      const currentDate = new Date();
      const currentWeek = Math.ceil(
        (currentDate - new Date(currentDate.getFullYear(), 0, 1)) /
          (7 * 24 * 60 * 60 * 1000)
      );
      filtered = filtered.filter((guest) => {
        const guestDate = new Date(guest.createdAt);
        const guestWeek = Math.ceil(
          (guestDate - new Date(guestDate.getFullYear(), 0, 1)) /
            (7 * 24 * 60 * 60 * 1000)
        );
        return (
          currentWeek === guestWeek &&
          currentDate.getFullYear() === guestDate.getFullYear()
        );
      });
    } else if (interval === "yearly") {
      const currentDate = new Date();
      filtered = filtered.filter((guest) => {
        const guestDate = new Date(guest.createdAt);
        return currentDate.getFullYear() === guestDate.getFullYear();
      });
    }

    setFilteredData(filtered);
  };

  return (
    <>
      <Topbar
        title={"Orders"}
        subtitle={"Manage your Orders with Overview and Analytics"}
      />
      <div className="manage-orders-page-container">
        <EventsList
          showHeader={true}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
        <div className="stats-cards-container">
          <StatCard
            title={"Tickets sold"}
            number={selectedEvent?.ticketsSold || 0}
            icon={<ReactSVG src="/icons/tools/ticket-filled-colored.svg" />}
            variant={"yellow-stat-card"}
            showCalendar={true}
          />
          <StatCard
            title={"Revenue generated"}
            number={
              currencySymbolGenerator(selectedEvent?.eventCurrency) +
              (parseInt(selectedEvent?.revenue).toFixed(2) || 0)
            }
            icon={<ReactSVG src="/icons/tools/dollar-filled-colored.svg" />}
            variant={"green-stat-card"}
            showCalendar={true}
          />
          <StatCard
            title={"Partikarte Fees"}
            number={
              currencySymbolGenerator(selectedEvent?.eventCurrency) +
              (
                (parseInt(selectedEvent?.revenue).toFixed(2) || 0) * 0.08
              ).toFixed(2)
            }
            icon={<ReactSVG src="/icons/tools/percentage-colored.svg" />}
            variant={"blue-stat-card"}
            showCalendar={true}
          />
          <StatCard
            title={"Total Paid Out"}
            number={
              currencySymbolGenerator(selectedEvent?.eventCurrency) +
              (parseInt(selectedEvent?.totalPaidOut).toFixed(2) || 0.0)
            }
            icon={<ReactSVG src="/icons/tools/clipboardtick-colored.svg" />}
            variant={"orange-stat-card"}
            showCalendar={true}
          />
        </div>
        {checkPermission("ordersAnalytics").status && (
          <div className="order-analytics-chart-container">
            <div className="container-header">
              <h3>Orders Analytics</h3>
              <select
                value={selectedInterval}
                onChange={(e) => setSelectedInterval(e.target.value)}
              >
                <option value={"monthly"}>Monthly</option>
                <option value={"weekly"}>Weekly</option>
                <option value={"yearly"}>Yearly</option>
              </select>
            </div>
            <Chart
              selectedEvent={selectedEvent}
              data={ordersDataForChart}
              height={290}
            />
          </div>
        )}

        {checkPermission("customerList").status && (
          <div className="table-container">
            <div className="table-container-header">
              <h3>Customers</h3>
              <div className="header-right">
                <div className="search-container">
                  <ReactSVG src="/icons/tools/search.svg" />
                  <input
                    onChange={(e) => handleSearchText(e.target.value)}
                    type="text"
                    name="search"
                    placeholder="Search customers"
                  />
                </div>
                <CSVLink
                  data={filteredData}
                  headers={customers}
                  filename={"customers-list.csv"}
                >
                  <SecondaryButton>
                    <ReactSVG src="/icons/tools/download-sheet.svg" />
                    <span>Download Database (CSV)</span>
                  </SecondaryButton>
                </CSVLink>
                <select
                  name="timeframe"
                  onChange={(e) => handleIntervalChange(e.target.value)}
                  value={interval}
                >
                  <option value={"monthly"}>Monthly</option>
                  <option value={"weekly"}>Weekly</option>
                  <option value={"yearly"}>Yearly</option>
                </select>
              </div>
            </div>

            <CustomersTable
              isLoading={isOrdersLoading}
              customersData={filteredData}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
