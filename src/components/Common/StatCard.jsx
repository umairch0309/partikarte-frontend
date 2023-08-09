import React from "react";
import "./StatCard.scss";
import { ReactSVG } from "react-svg";

const StatCard = ({ title, number, icon, variant, showCalendar }) => {
  return (
    <div className="stats-card-main-container">
      <div className="stats-card-left">
        <div className={`stats-icon-container ${variant}`}>
          {icon}
          {showCalendar && (
            <div className="stats-calendar-icon-container">
              <ReactSVG src="/icons/tools/calendar-filled-colored.svg" />
            </div>
          )}
        </div>
      </div>

      <div className="stats-card-right">
        <p>{title}</p>
        <h3>{number}</h3>
      </div>
    </div>
  );
};

export default StatCard;
