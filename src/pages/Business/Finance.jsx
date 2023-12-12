import React, { useEffect } from "react";
import "./Finance.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import SecondaryButton from "../../components/UI/SecondaryButton";
import { ReactSVG } from "react-svg";
import StatCard from "../../components/Common/StatCard";
import { useState } from "react";

import { CSVLink } from "react-csv";
import { transactionsHeaders } from "../../utilities/csv-headers";
import { useProfileDetails } from "../../api/profile";
import { useBusinessTransactions } from "../../api/transactions";
import TransactionsTable from "../../components/Tables/TransactionsTable";
import usePermissionCheck from "../../hooks/usePermissionCheck";
import currencySymbolGenerator from "../../utilities/currencySymbolGenerator";

const Finance = () => {
  const { checkPermission } = usePermissionCheck();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const { isLoading } = useProfileDetails((res) => {
    if (res?.data) {
      setData(res?.data);
    }
  });

  const { isLoading: isTransactionsLoading } = useBusinessTransactions(
    (res) => {
      if (res?.transactions) {
        setTransactions(res?.transactions);
        setFilteredData(res?.transactions);
      }
    }
  );

  return (
    <>
      <Topbar
        title={"Finance"}
        subtitle={"Manage your Finance with Overview and Analytics"}
      />
      <div className="manage-orders-page-container">
        {checkPermission("financeTransactionStats").status && (
          <div className="stats-cards-container">
            <StatCard
              title={"Sales"}
              number={
                currencySymbolGenerator("EUR") +
                (parseInt(data?.business?.earnings?.currentBalance).toFixed(
                  2
                ) || 0)
              }
              icon={<ReactSVG src="/icons/tools/dollar-filled-colored.svg" />}
              variant={"blue-stat-card"}
              showCalendar={false}
            />
            <StatCard
              title={"Fees"}
              number={
                currencySymbolGenerator("EUR") +
                (parseInt(data?.business?.earnings?.totalEarnings).toFixed(2) ||
                  0)
              }
              icon={<ReactSVG src="/icons/tools/dollar-filled-colored.svg" />}
              variant={"green-stat-card"}
              showCalendar={false}
            />
            <StatCard
              title={"Earnings"}
              number={
                currencySymbolGenerator("EUR") +
                (parseInt(
                  data?.business?.earnings?.totalEarnings -
                    data?.business?.earnings?.currentBalance
                ).toFixed(2) || 0)
              }
              icon={<ReactSVG src="/icons/tools/dollar-filled-colored.svg" />}
              variant={"yellow-stat-card"}
              showCalendar={false}
            />
          </div>
        )}

        {checkPermission("financeTransactionList").status && (
          <div className="table-container">
            <div className="table-container-header">
              <h3>Bank Transactions</h3>
              <div className="header-right">
                <CSVLink
                  data={filteredData}
                  headers={transactionsHeaders}
                  filename={"transactions-list.csv"}
                >
                  <SecondaryButton>
                    <ReactSVG src="/icons/tools/download-sheet.svg" />
                    <span>Download Database (CSV)</span>
                  </SecondaryButton>
                </CSVLink>
              </div>
            </div>
            <TransactionsTable
              loading={isTransactionsLoading}
              transactionsData={filteredData}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Finance;
