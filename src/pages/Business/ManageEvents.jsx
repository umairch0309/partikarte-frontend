import React from "react";
import "./ManageEvents.scss";
import Topbar from "../../components/Layouts/BusinessLayout/Topbar";
import EventsList from "../../components/Common/EventsList";
import SecondaryButton from "../../components/UI/SecondaryButton";
import { ReactSVG } from "react-svg";
import StatCard from "../../components/Common/StatCard";
import Chart from "../../components/Common/Chart";
import { useState, useEffect } from "react";
import CountriesRevenueTable from "../../components/Tables/CountriesRevenueTable";
import EventAnalyticsTable from "../../components/Tables/EventAnalyticsTable";
import AddNewEventModal from "../../components/ManageEvents/AddNewEventModal";
import useIsMobileWidth from "../../hooks/useIsMobileWidth";
import { useNavigate } from "react-router-dom";
import { useOrdersByTimeInterval } from "../../api/orders";
import EditEvent from "../../components/ManageEvents/EditEvent";
import PrimaryButton from "../../components/UI/PrimaryButton";
import { message } from "antd";
import { usePostApi } from "../../hooks/api-hooks/usePostApi";
import { usePutApi } from "../../hooks/api-hooks/usePutApi";
import { useQueryClient } from "@tanstack/react-query";
import { useCouponByEventId } from "../../api/coupons";
import TertiaryButton from "../../components/UI/TertiaryButton";
import { WEB_URL } from "../../constants";
import usePermissionCheck from "../../hooks/usePermissionCheck";

const couponInitialState = { discount: 0 };

const ManageEvents = () => {
  const navigate = useNavigate();
  const { checkPermission } = usePermissionCheck();
  const [countriesRevenues, setCountriesRevenues] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [showAddNewEventModal, setShowAddNewEventModal] = useState(false);
  const [showEditEventModal, setShoweditEventModal] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState("weekly");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTable, setSelectedTable] = useState(0);
  const [eventCoupon, setEventCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState(couponInitialState);

  const isMobile = useIsMobileWidth();

  const [ordersDataForChart, setOrdersDataForChart] = useState([]);
  const { isLoading: isOrderChartDataLoading } = useOrdersByTimeInterval(
    [selectedInterval, selectedEvent?._id],
    `${selectedInterval}${
      selectedEvent?._id ? `?eventId=${selectedEvent?._id}` : ""
    }`,
    (res) => {
      // console.log(res);
      setOrdersDataForChart(res?.orders);
    }
  );

  const { isLoading: isCouponLoading } = useCouponByEventId(
    selectedEvent?._id,
    (res) => {
      setEventCoupon(res?.coupon);
      setCouponForm({ discount: res?.coupon?.discount });
    },
    (res) => {
      setCouponForm(couponInitialState);
      setEventCoupon(null);
    }
  );

  const { handleMutation, isLoading: isCreating } = usePostApi();
  const { handleMutation: handleUpdate, isLoading: isUpdating } = usePutApi();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedEvent?._id !== eventCoupon?.eventId) {
      setCouponForm(couponInitialState);
      setEventCoupon(null);
    }
  }, [selectedEvent?._id]);

  useEffect(() => {
    const array = [];
    for (let i = 0; i < 5; i++) {
      const row = {
        key: i,
        location: "Jordan",
        revenueGenerated: "23480",
      };
      array.push(row);
    }
    setCountriesRevenues(array);
  }, []);

  useEffect(() => {
    const array = [];
    for (let i = 0; i < 5; i++) {
      const row = {
        key: i,
        title: "Number of orders",
        values: "343 Orders",
      };
      array.push(row);
    }
    setAnalytics(array);
  }, []);

  const copyToClipboard = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Copied to clipboard.");
      })
      .catch((error) => {
        message.error("Couldn't copy to clipboard.");
      });
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setCouponForm((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleSubmitCouponForm = () => {
    if (
      !couponForm ||
      couponForm.discount === 0 ||
      couponForm.discount > 100 ||
      couponForm.discount < 0
    ) {
      message.error("Invalid discount value.");
      return;
    }

    if (eventCoupon) {
      handleUpdate(
        {
          path: `coupon/update/${selectedEvent?._id}/${eventCoupon?._id}`,
          data: couponForm,
        },
        (res) => {
          setEventCoupon(res?.data?.coupon);
          queryClient.invalidateQueries(["get-coupon", selectedEvent?._id]);
          setCouponForm({ discount: res?.data?.coupon?.discount });
        },
        (res) => {}
      );
    } else {
      handleMutation(
        {
          path: `coupon/create/${selectedEvent?._id}`,
          data: couponForm,
        },
        (res) => {
          setEventCoupon(res?.coupon);
          queryClient.invalidateQueries(["get-coupon", selectedEvent?._id]);
          setCouponForm({ discount: res?.coupon?.discount });
        },
        (res) => {}
      );
    }
  };

  const expireCoupon = () => {
    handleUpdate(
      {
        path: `coupon/expire/${selectedEvent?._id}/${eventCoupon?._id}`,
        data: couponForm,
      },
      (res) => {
        setEventCoupon(res?.data?.coupon);
        queryClient.invalidateQueries(["get-coupon", selectedEvent?._id]);
        setCouponForm({ discount: res?.data?.coupon?.discount });
      },
      (res) => {}
    );
  };

  const activateCoupon = () => {
    handleUpdate(
      {
        path: `coupon/activate/${selectedEvent?._id}/${eventCoupon?._id}`,
        data: couponForm,
      },
      (res) => {
        setEventCoupon(res?.data?.coupon);
        queryClient.invalidateQueries(["get-coupon", selectedEvent?._id]);
        setCouponForm({ discount: res?.data?.coupon?.discount });
      },
      (res) => {}
    );
  };

  return (
    <>
      <Topbar
        title={"Manage Events"}
        subtitle={"Manage your Events with Overview and Analytics"}
      />
      <div className="manage-events-page-container">
        <EventsList
          setShowAddNewEventModal={setShowAddNewEventModal}
          showHeader={true}
          showInputs={true}
          showActions={true}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          setShoweditEventModal={setShoweditEventModal}
        />
        <div className="event-page-actions">
          <SecondaryButton
            onClick={() => {
              navigate("/business/guestlists");
            }}
          >
            <ReactSVG src="/icons/tools/people-list.svg" />
            <span>Manage Guest Lists</span>
          </SecondaryButton>
          <SecondaryButton
            onClick={() => {
              navigate("/business/manage-tickets");
            }}
          >
            <ReactSVG src="/icons/tools/ticket-outlined.svg" />
            <span>Manage tickets</span>
          </SecondaryButton>
          <select
            name="timeframe"
            onChange={(e) => setSelectedInterval(e.target.value)}
          >
            <option value={"monthly"}>Monthly</option>
            <option value={"weekly"}>Weekly</option>
            <option value={"yearly"}>Yearly</option>
          </select>
        </div>
        <div className="stats-cards-container">
          <StatCard
            title={"Tickets sold"}
            number={selectedEvent?.ticketsSold || 0}
            icon={<ReactSVG src="/icons/tools/ticket-filled-colored.svg" />}
            variant={"yellow-stat-card"}
            showCalendar={true}
          />
          <StatCard
            title={"Number of guests"}
            number={selectedEvent?.ticketsSold || 0}
            icon={<ReactSVG src="/icons/tools/people-list-colored.svg" />}
            variant={"blue-stat-card"}
            showCalendar={true}
          />
          <StatCard
            title={"Revenue generated"}
            number={"€" + (selectedEvent?.revenue || 0)}
            icon={<ReactSVG src="/icons/tools/dollar-filled-colored.svg" />}
            variant={"green-stat-card"}
            showCalendar={true}
          />
        </div>
        {checkPermission("ticketsAnalytics").status && (
          <div className="order-analytics-chart-container">
            <div className="container-header">
              <h3>Tickets Analytics</h3>
            </div>
            <Chart
              data={ordersDataForChart}
              selectedInterval={selectedInterval}
              height={290}
            />
          </div>
        )}
        {/* {isMobile && (
          <div className="tables-selection-buttons-container">
            <button
              className={selectedTable === 1 ? "selected-button" : ""}
              onClick={() => setSelectedTable(1)}
            >
              Cities/Countries
            </button>
            <button
              className={selectedTable === 2 ? "selected-button" : ""}
              onClick={() => setSelectedTable(2)}
            >
              Analytics
            </button>
          </div>
        )} */}
        {/* <div className="all-tables-main-container">
          {!isMobile && (
            <div className="table-container">
              <div className="table-container-header">
                <h3>Cities/Countries</h3>
              </div>
              <CountriesRevenueTable countriesData={countriesRevenues} />
            </div>
          )}
          {isMobile && selectedTable === 1 && (
            <div className="table-container">
              <div className="table-container-header">
                <h3>Cities/Countries</h3>
              </div>
              <CountriesRevenueTable countriesData={countriesRevenues} />
            </div>
          )}
          {!isMobile && (
            <div className="table-container">
              <div className="table-container-header">
                <h3>Analytics</h3>
              </div>
              <EventAnalyticsTable analyticsData={analytics} />
            </div>
          )}
          {isMobile && selectedTable === 2 && (
            <div className="table-container">
              <div className="table-container-header">
                <h3>Analytics</h3>
              </div>
              <EventAnalyticsTable analyticsData={analytics} />
            </div>
          )}
        </div> */}

        {checkPermission("generateCouponCode").status && (
          <div className="coupon-code-container">
            <div className="container-header">
              <h3>Discount Coupon</h3>
            </div>
            <div className="coup-code-main">
              <div className="form-item">
                <label>Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  onChange={handleOnChange}
                  value={couponForm.discount}
                />
              </div>
              {eventCoupon && (
                <div className="form-item copy-code">
                  <label>Generated Code</label>
                  <input type="text" disabled value={eventCoupon?.code} />
                  <ReactSVG
                    className="copy-icon"
                    src="/icons/tools/copy.svg"
                    onClick={() =>
                      copyToClipboard(`${WEB_URL}${eventCoupon?.code}`)
                    }
                  />
                </div>
              )}
              <PrimaryButton onClick={handleSubmitCouponForm}>
                {!eventCoupon ? "Generate" : "Update"} Coupon Code
              </PrimaryButton>
              {eventCoupon && !eventCoupon?.isExpired && (
                <TertiaryButton onClick={expireCoupon}>
                  Expire Coupon
                </TertiaryButton>
              )}
              {eventCoupon && eventCoupon?.isExpired && (
                <TertiaryButton onClick={activateCoupon}>
                  Activate Coupon
                </TertiaryButton>
              )}
            </div>
          </div>
        )}

        <div className="coupon-code-container">
          <div className="container-header">
            <h3>Event Tickets Scanning</h3>
          </div>
          <div className="coup-code-main">
            <div className="form-item">
              <div className="form-item copy-code">
                <label>Generated Code</label>
                <input type="text" disabled value={selectedEvent?.eventCode} />
                <ReactSVG
                  className="copy-icon"
                  src="/icons/tools/copy.svg"
                  onClick={() => copyToClipboard(`${selectedEvent?.eventCode}`)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddNewEventModal
        showAddNewEventModal={showAddNewEventModal}
        setShowAddNewEventModal={setShowAddNewEventModal}
      />
      <EditEvent
        showEditEventModal={showEditEventModal}
        setShoweditEventModal={setShoweditEventModal}
        selectedEvent={selectedEvent}
      />
    </>
  );
};

export default ManageEvents;
