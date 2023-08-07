import React, { useEffect, useState } from "react";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import "./Dashboard.scss";
import Chart from "../../components/Common/Chart";
import OrdersTable from "../../components/Tables/OrdersTable";

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const array = [];
    for (let i = 0; i < 100; i++) {
      array.push({
        key: i,
        _id: i + 88347,
        customerName: "John Smith",
        eventName: "Get to know yourself!",
        ticketType: "VVIP",
        price: "100",
        purchaseDate: "24 Jan, 2023",
      });
    }
    setData(array);
  }, []);

  const dummyEvents = [
    {
      eventName: "Event 1",
      description:
        "Some description about the ticket will be there which will be in around 2 lines note more than that...",
      date: "24 March, 2023",
      revenue: "$675",
      ticketCount: "413 Tickets",
    },
    {
      eventName: "Event 1",
      description:
        "Some description about the ticket will be there which will be in around 2 lines note more than that...",
      date: "24 March, 2023",
      revenue: "$675",
      ticketCount: "413 Tickets",
    },
    {
      eventName: "Event 1",
      description:
        "Some description about the ticket will be there which will be in around 2 lines note more than that...",
      date: "24 March, 2023",
      revenue: "$675",
      ticketCount: "413 Tickets",
    },
    {
      eventName: "Event 1",
      description:
        "Some description about the ticket will be there which will be in around 2 lines note more than that...",
      date: "24 March, 2023",
      revenue: "$675",
      ticketCount: "413 Tickets",
    },
  ];

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
                <select>
                  <option>Event</option>
                  <option value={"event1"}>Event 1</option>
                  <option value={"event1"}>Event 2</option>
                  <option value={"event1"}>Event 3</option>
                  <option value={"event1"}>Event 4</option>
                  <option value={"event1"}>Event 5</option>
                </select>
                <select>
                  <option>Ticket type</option>
                  <option value={"VIP"}>VIP</option>
                  <option value={"VIP"}>VVIP</option>
                  <option value={"VIP"}>Economy</option>
                </select>
                <select>
                  <option value={"monthly"}>Monthly</option>
                  <option value={"yearly"}>Yearly</option>
                  <option value={"weekly"}>Weekly</option>
                </select>
              </div>
            </div>
            <Chart height={290} />
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
            <OrdersTable ordersData={data} />
          </div>
        </div>
        <div className="dashboard-page-right">
          <div className="active-events-container">
            <h3>Active Events</h3>
            <div className="all-active-events-container">
              {dummyEvents.map((event, index) => (
                <div className="single-active-event" key={index}>
                  <h5>{event.eventName}</h5>
                  <h6>{event.description}</h6>
                  <div className="more-button-container">
                    <button>More</button>
                    <p>{event.date}</p>
                  </div>
                  <hr />
                  <div className="revenue-details-container">
                    <p>Total Revenue Generated:</p>
                    <h3>
                      {event.revenue} <span>({event.ticketCount})</span>
                    </h3>
                  </div>
                </div>
              ))}
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
