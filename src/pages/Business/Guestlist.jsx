import React, { useEffect, useState } from "react";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import "./Guestlist.scss";
import EventsList from "../../components/Common/EventsList";
import { ReactSVG } from "react-svg";
import GuestTable from "../../components/Tables/GuestTable";
import AddPeopleToGuestlistModal from "../../components/Guestlist/AddPeopleToGuestlistModal";
import AddMultiplePeopleToGuestlistModal from "../../components/Guestlist/AddMultiplePeopleToGuestlistModal";
import SecondaryButton from "../../components/UI/SecondaryButton";
import { useAllGuestsForEvent } from "../../api/guests";
import { guestlist } from "../../utilities/csv-headers";
import { CSVLink } from "react-csv";

const Guestlist = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [guestType, setGuestType] = useState("allGuestTypes");
  const [notified, setNotified] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [interval, setInterval] = useState("monthly");

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [editSelected, setEditSelected] = useState(null);
  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);
  const [showMultiplePeopleModal, setShowMultiplePeopleModal] = useState(false);

  const { isLoading } = useAllGuestsForEvent(selectedEvent?._id, (res) => {
    console.log(res);
    setData(res?.guests);
    setFilteredData(res?.guests);
  });

  const handleSearchText = (text) => {
    applyFilters(text, guestType, notified, interval);
    setSearchText(text);
  };

  const handleIntervalChange = (text) => {
    applyFilters(searchText, guestType, notified, text);
    setInterval(text);
  };

  const handleGuestTypeFilter = (value) => {
    setGuestType(value);
    applyFilters(searchText, value, notified, interval);
  };

  const handleNotifiedFilter = (value) => {
    setNotified(value);
    applyFilters(searchText, guestType, value, interval);
  };

  const applyFilters = (searchText, guestType, notified, interval) => {
    let filtered = data;

    filtered = filtered.filter((guest) =>
      JSON.stringify(guest)?.toLowerCase()?.includes(searchText?.toLowerCase())
    );

    if (guestType !== "allGuestTypes") {
      filtered = filtered.filter((guest) => guest.guestType === guestType);
    }

    if (notified === "allNotNotified") {
      filtered = filtered.filter((guest) => guest?.isNotified === false);
    } else if (notified === "allNotified") {
      filtered = filtered.filter((guest) => guest?.isNotified === true);
    }

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
        title={"Guest List"}
        subtitle={"Explore or customise your guests!"}
      />
      <div className="guestlist-page-container">
        <EventsList
          setSelectedEvent={setSelectedEvent}
          selectedEvent={selectedEvent}
        />
        <div className="guestlist-page-bottom-main">
          <div className="guestlist-page-bottom-main-header">
            <div className="header-left">
              <div className="search-container">
                <ReactSVG src="/icons/tools/search.svg" />
                <input
                  onChange={(e) => handleSearchText(e.target.value)}
                  type="text"
                  name="search"
                  placeholder="Search guests"
                />
              </div>
              <select
                name="guestType"
                onChange={(e) => handleGuestTypeFilter(e.target.value)}
                value={guestType}
              >
                <option value={"allGuestTypes"}>All guest types</option>
                <option value={"vip"}>VIP</option>
                <option value={"vvip"}>VVIP</option>
                <option value={"economy"}>Economy</option>
              </select>
              <select
                name="notified"
                value={notified}
                onChange={(e) => handleNotifiedFilter(e.target.value)}
              >
                <option value={"allNotified"}>All notified</option>
                <option value={"allNotNotified"}>Not notified</option>
                <option value={"all"}>All</option>
              </select>
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
            <div className="header-right">
              <SecondaryButton onClick={() => setShowAddPeopleModal(true)}>
                <ReactSVG src="/icons/tools/people-list.svg" />
                <span>Add People to Guest List</span>
              </SecondaryButton>
              <CSVLink
                data={filteredData}
                headers={guestlist}
                filename={"guests-list.csv"}
              >
                <SecondaryButton className="royal-blue-button">
                  <ReactSVG src="/icons/tools/download-sheet.svg" />
                  <span>Download Spreadsheet</span>
                </SecondaryButton>
              </CSVLink>
              {/* <SecondaryButton className="royal-blue-button">
                <ReactSVG src="/icons/tools/plus-person.svg" />
                <span>Create Guest Lists</span>
              </SecondaryButton> */}
            </div>
          </div>
          <GuestTable
            setSelectedGuest={setSelectedGuest}
            setShowAddPeopleModal={setShowAddPeopleModal}
            isLoading={isLoading}
            guestsData={filteredData}
            setEditSelected={setEditSelected}
            selectedGuest={selectedGuest}
          />
        </div>
      </div>
      <AddPeopleToGuestlistModal
        showAddPeopleModal={showAddPeopleModal}
        setShowAddPeopleModal={setShowAddPeopleModal}
        setShowMultiplePeopleModal={setShowMultiplePeopleModal}
        selectedEvent={selectedEvent}
        selectedGuest={selectedGuest}
        setSelectedGuest={setSelectedGuest}
        setEditSelected={setEditSelected}
        editSelected={editSelected}
      />
      <AddMultiplePeopleToGuestlistModal
        showMultiplePeopleModal={showMultiplePeopleModal}
        setShowAddPeopleModal={setShowAddPeopleModal}
        setShowMultiplePeopleModal={setShowMultiplePeopleModal}
      />
    </>
  );
};

export default Guestlist;
