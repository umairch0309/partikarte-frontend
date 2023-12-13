import React from "react";
import "./Customers.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import EventsList from "../../components/Common/EventsList";
import SecondaryButton from "../../components/UI/SecondaryButton";
import { ReactSVG } from "react-svg";
import { useState } from "react";
import CustomersTable from "../../components/Tables/CustomersTable";
import { useOrdersByEventId } from "../../api/orders";
import { CSVLink } from "react-csv";
import { customers } from "../../utilities/csv-headers";
import usePermissionCheck from "../../hooks/usePermissionCheck";

const Customers = () => {
  const { checkPermission } = usePermissionCheck();
  const [data, setData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [interval, setInterval] = useState("weekly");
  const [searchText, setSearchText] = useState("");

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

    if (interval === "today") {
      const currentDate = new Date();
      filtered = filtered.filter((guest) => {
        const guestDate = new Date(guest.createdAt);
        return (
          guestDate.toLocaleDateString() === currentDate.toLocaleDateString()
        );
      });
    } else if (interval === "monthly") {
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
        title={"Customers"}
        subtitle={"Manage your Customers with Overview and Analytics"}
      />
      <div className="customers-page-container">
        <EventsList
          showHeader={true}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />

        {checkPermission("viewCustomers").status && (
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
                  <option value={"today"}>Today</option>
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

export default Customers;
