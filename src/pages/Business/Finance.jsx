import React, { useState } from "react";
import "./Finance.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import SecondaryButton from "../../components/UI/SecondaryButton";
import { ReactSVG } from "react-svg";
import StatCard from "../../components/Common/StatCard";
import { CSVLink } from "react-csv";
import { transactionsHeaders } from "../../utilities/csv-headers";
import { useBusinessTransactions } from "../../api/transactions";
import { useBusinessFinanceSummary } from "../../api/orders";
import TransactionsTable from "../../components/Tables/TransactionsTable";
import usePermissionCheck from "../../hooks/usePermissionCheck";
import currencySymbolGenerator from "../../utilities/currencySymbolGenerator";

const formatMoney = (amount, currency = "EUR") => {
  const value = Number(amount || 0);
  return `${currencySymbolGenerator(currency)}${value.toFixed(2)}`;
};

const Finance = () => {
  const { checkPermission } = usePermissionCheck();
  const [finance, setFinance] = useState({
    totalSales: 0,
    totalFees: 0,
    totalEarnings: 0,
    currentBalance: 0,
    currency: "EUR",
    feePercent: 8,
  });
  const [filteredData, setFilteredData] = useState([]);

  const { isLoading: isFinanceLoading } = useBusinessFinanceSummary((res) => {
    const summary = res?.data || res;
    if (summary) {
      setFinance({
        totalSales: summary.totalSales || 0,
        totalFees: summary.totalFees || 0,
        totalEarnings: summary.totalEarnings || 0,
        currentBalance: summary.currentBalance || 0,
        currency: summary.currency || "EUR",
        feePercent: summary.feePercent || 8,
      });
    }
  });

  const { isLoading: isTransactionsLoading } = useBusinessTransactions(
    (res) => {
      const transactions = res?.transactions || [];
      setFilteredData(transactions);
    }
  );

  const currency = finance.currency || "EUR";

  return (
    <>
      <Topbar
        title={"Finance"}
        subtitle={"Overview & Manage your Event Finances"}
      />
      <div className="manage-orders-page-container">
        {checkPermission("financeTransactionStats").status && (
          <div className="stats-cards-container">
            <StatCard
              title={"Sales"}
              number={
                isFinanceLoading
                  ? "…"
                  : formatMoney(finance.totalSales, currency)
              }
              icon={<ReactSVG src="/icons/tools/dollar-filled-colored.svg" />}
              variant={"blue-stat-card"}
              showCalendar={false}
            />
            <StatCard
              title={`Fees (${finance.feePercent}%)`}
              number={
                isFinanceLoading
                  ? "…"
                  : formatMoney(finance.totalFees, currency)
              }
              icon={<ReactSVG src="/icons/tools/dollar-filled-colored.svg" />}
              variant={"green-stat-card"}
              showCalendar={false}
            />
            <StatCard
              title={"Earnings"}
              number={
                isFinanceLoading
                  ? "…"
                  : formatMoney(finance.totalEarnings, currency)
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
