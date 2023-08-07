import React, { useEffect, useState } from "react";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import "./Guestlist.scss";
import EventsList from "../../components/Common/EventsList";
import { ReactSVG } from "react-svg";
import GuestTable from "../../components/Tables/GuestTable";
import AddPeopleToGuestlistModal from "../../components/Guestlist/AddPeopleToGuestlistModal";

const Guestlist = () => {
  const [data, setData] = useState([]);
  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);

  useEffect(() => {
    const array = [];
    for (let i = 0; i < 100; i++) {
      const row = {
        key: i,
        name: "John",
        surname: "Smith",
        guestType: "VIP",
        email: "john.smith@example.com",
        phoneNumber: "123-456-7890",
        notified: true,
        dateAdded: "2023-01-24",
        addedBy: "Admin",
      };
      array.push(row);
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
        title={"Guest List"}
        subtitle={"Explore or customise your guests!"}
      />
      <div className="guestlist-page-container">
        <EventsList />
        <div className="guestlist-page-bottom-main">
          <div className="guestlist-page-bottom-main-header">
            <div className="header-left">
              <div className="search-container">
                <ReactSVG src="/icons/tools/search.svg" />
                <input type="text" name="search" placeholder="Search guests" />
              </div>
              <select name="guestType">
                <option value={"allGuestTypes"}>All guest types</option>
                <option value={"guestType1"}>Guest type 1</option>
                <option value={"guestType2"}>Guest type 2</option>
                <option value={"guestType3"}>Guest type 3</option>
              </select>
              <select name="notified">
                <option value={"allNotified"}>All notified</option>
                <option value={"allNotNotified"}>Not notified</option>
                <option value={"all"}>All</option>
              </select>
              <select name="timeframe">
                <option value={"monthly"}>Monthly</option>
                <option value={"weekly"}>Weekly</option>
                <option value={"yearly"}>Yearly</option>
              </select>
            </div>
            <div className="header-right">
              <button onClick={() => setShowAddPeopleModal(true)}>
                <ReactSVG src="/icons/tools/people-list.svg" />
                <span>Add People to Guest List</span>
              </button>
              <button className="royal-blue-button">
                <ReactSVG src="/icons/tools/download-sheet.svg" />
                <span>Download Spreadsheet</span>
              </button>
              <button className="royal-blue-button">
                <ReactSVG src="/icons/tools/plus-person.svg" />
                <span>Create Guest Lists</span>
              </button>
            </div>
          </div>
          <GuestTable guestsData={data} />
        </div>
      </div>
      <AddPeopleToGuestlistModal
        showAddPeopleModal={showAddPeopleModal}
        setShowAddPeopleModal={setShowAddPeopleModal}
      />
    </>
  );
};

export default Guestlist;
