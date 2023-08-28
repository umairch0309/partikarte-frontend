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
import { useOrdersByTimeInterval } from "../../api/orders";

const Orders = () => {
  const [data, setData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ordersDataForChart, setOrdersDataForChart] = useState([]);

  const { isLoading: isOrderChartDataLoading } = useOrdersByTimeInterval(
    "monthly",
    (res) => {
      console.log(res);
      setOrdersDataForChart(res?.orders);
    }
  );

  useEffect(() => {
    const array = [];
    for (let i = 0; i < 100; i++) {
      const row = {
        key: i,
        name: "John",
        surname: "Smith",
        orderAmount: "932847",
        email: "john.smith@example.com",
        phoneNumber: "123-456-7890",
        dateTime: "24 Jan, 2023 (14:56)",
        noOfTickets: "6",
      };
      array.push(row);
    }
    setData(array);
  }, []);

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
            number={8186}
            icon={<ReactSVG src="/icons/tools/ticket-filled-colored.svg" />}
            variant={"yellow-stat-card"}
            showCalendar={true}
          />
          <StatCard
            title={"Revenue generated"}
            number={"$" + 8186}
            icon={<ReactSVG src="/icons/tools/dollar-filled-colored.svg" />}
            variant={"green-stat-card"}
            showCalendar={true}
          />
          <StatCard
            title={"Partikarte Fees"}
            number={345}
            icon={<ReactSVG src="/icons/tools/percentage-colored.svg" />}
            variant={"blue-stat-card"}
            showCalendar={true}
          />
          <StatCard
            title={"Total Paid Out"}
            number={"$" + 8186}
            icon={<ReactSVG src="/icons/tools/clipboardtick-colored.svg" />}
            variant={"orange-stat-card"}
            showCalendar={true}
          />
        </div>
        <div className="order-analytics-chart-container">
          <div className="container-header">
            <h3>Orders Analytics</h3>
            <select name="timeframe">
              <option value={"monthly"}>Monthly</option>
              <option value={"weekly"}>Weekly</option>
              <option value={"yearly"}>Yearly</option>
            </select>
          </div>
          <Chart data={ordersDataForChart} height={290} />
        </div>

        <div className="table-container">
          <div className="table-container-header">
            <h3>Customers</h3>
            <div className="header-right">
              <div className="search-container">
                <ReactSVG src="/icons/tools/search.svg" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search customers"
                />
              </div>
              <SecondaryButton>
                <ReactSVG src="/icons/tools/download-sheet.svg" />
                <span>Download Database (CSV)</span>
              </SecondaryButton>
              <select name="timeframe">
                <option value={"monthly"}>Monthly</option>
                <option value={"weekly"}>Weekly</option>
                <option value={"yearly"}>Yearly</option>
              </select>
            </div>
          </div>

          <CustomersTable customersData={data} />
        </div>
      </div>
    </>
  );
};

export default Orders;
