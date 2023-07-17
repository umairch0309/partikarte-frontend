import React, { useState } from "react";
import "./TopSearch.scss";

const filterButtons = ["All", "Today", "Tomorrow", "Weekend"];
const TopSearch = () => {
  const [activeButton, setActiveButton] = useState(filterButtons[0]);

  return (
    <div className="user-top-search">
      <h1>Explore the Night</h1>
      <div className="search-main-container">
        <input placeholder="Search Event..." />
        <hr />
        <p>Anywhere</p>
      </div>
      <div className="date-filters">
        {filterButtons.length > 0 &&
          filterButtons.map((item) => (
            <button
              key={item}
              onClick={() => setActiveButton(item)}
              className={`date-filter-button ${
                activeButton === item ? "active" : ""
              }`}
            >
              {item}
            </button>
          ))}
      </div>
    </div>
  );
};

export default TopSearch;
