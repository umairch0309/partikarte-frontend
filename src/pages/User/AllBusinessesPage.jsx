import React, { useState } from "react";
import "./AllBusinessesPage.scss";
import { useAllBusinessesForCustomer } from "../../api/business";
import { Link, useNavigate } from "react-router-dom";

const AllBusinessesPage = () => {
  const [searchedText, setSearchedText] = useState("");
  const [data, setData] = useState([]);

  useAllBusinessesForCustomer((res) => {
    setData(res?.businesses || []);
  });

  const navigate = useNavigate();

  return (
    <div className="all-businesses-page-main-container">
      <div className="all-businesses-page-header">
        <img src="/images/policies-banner.jpg" alt="policies banner" />
        <input
          placeholder="Search..."
          value={searchedText}
          onChange={(e) => setSearchedText(e.target.value)}
        />
      </div>
      <div className="all-businesses-items-main-container">
        {data
          ?.filter((el) =>
            JSON.stringify(el?.company?.companyName)
              ?.toLowerCase()
              .includes(searchedText?.toLowerCase())
          )
          .map((event, index) => {
            return (
              <div
                onClick={() => navigate(`/business-profile/${event?._id}`)}
                key={index}
                className="gallery-item-container"
              >
                <img
                  src={event?.organizerImageBanner || "/images/event-1.jpg"}
                  alt={event?.company?.companyName}
                />
                <div className="organizer-tag">
                  <img
                    src={event?.organizerImage || "/images/event-1.jpg"}
                    alt={event?.company?.companyName}
                  />
                  <h5>{event?.company?.companyName}</h5>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AllBusinessesPage;
