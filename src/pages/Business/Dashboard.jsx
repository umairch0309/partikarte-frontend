import React from "react";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import "./Dashboard.scss";
import Chart from "../../components/Common/Chart";

const Dashboard = () => {
  return (
    <>
      <Topbar />
      <div className="dashboard-page-container">
        <div className="dashboard-page-left">
          <div className="chart-main-container">
            <Chart height={290} />
          </div>
        </div>
        <div className="dashboard-page-right"></div>
      </div>
    </>
  );
};

export default Dashboard;
