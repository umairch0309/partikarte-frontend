import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import "./CheckoutPage.scss";
import HeaderPlaceHolder from "../../components/Layouts/UserLayout/HeaderPlaceHolder";
import CheckoutSelectedEvent from "../../components/Common/CheckoutSelectedEvent";
import Checkout from "../../components/Common/Checkout";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useBookingContext } from "../../context/booking-context";
import { useSingleEventForCustomer } from "../../api/manage-events";
import { Skeleton } from "antd";
import currencySymbolGenerator from "../../utilities/currencySymbolGenerator";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state } = useBookingContext();
  const [data, setData] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const { isLoading } = useSingleEventForCustomer(state.eventId, (res) => {
    const event = res?.event;
    setData(
      event
        ? {
            ...event,
            tickets: Array.isArray(event.tickets) ? event.tickets : [],
          }
        : null
    );
  });

  useEffect(() => {
    if (!(state.totalTickets > 0)) {
      navigate("/");
    }
  }, [state]);

  const totalPriceCalculated = () => {
    let total = state.orderAmount?.toFixed(2);
    const couponDiscount = state.orderAmount?.toFixed(2) / coupon?.discount;
    if (coupon?.discount && couponDiscount) {
      total = total - couponDiscount;
    }
    return total;
  };

  return state?.eventId ? (
    <div className="checkout-payment-page">
      <HeaderPlaceHolder />
      <div className="checkout-payment-main-container">
        <div className="checkout-container-left">
          <div onClick={() => navigate(-1)} className="back-button">
            <ReactSVG src="/icons/tools/left-arrow.svg" />
            <p>Back</p>
          </div>
          <div className="checkout-left-main">
            <h5>Total Amount</h5>
            <h1>
              {currencySymbolGenerator(data?.eventCurrency)}
              {totalPriceCalculated()}
            </h1>
            {!isLoading ? (
              <>
                <div className="selected-event">
                  <img src={data?.eventBanner} />
                  <h3>{data?.eventName}</h3>
                </div>
                <div className="selected-tickets-container">
                  {state.tickets.map((ticket) => {
                    return (
                      ticket?.show && (
                        <CheckoutSelectedEvent
                          key={ticket.ticketId}
                          ticket={ticket}
                          eventCurrency={data?.eventCurrency}
                        />
                      )
                    );
                  })}
                </div>
              </>
            ) : (
              <Skeleton active={true} paragraph={{ rows: 4 }} size={"small"} />
            )}
            <div className="totals-container">
              <div className="totals-item">
                <h4>Subtotal</h4>
                <h4>
                  {" "}
                  {currencySymbolGenerator(data?.eventCurrency)}{" "}
                  {totalPriceCalculated()}
                </h4>
              </div>
              <hr />{" "}
              <div className="totals-item tax-item">
                <h4>Sales tax (6.5%)</h4>
                <h4>
                  {" "}
                  {currencySymbolGenerator(data?.eventCurrency)}{" "}
                  {state?.orderAmountWithVat?.toFixed(2)}
                </h4>
              </div>
              <hr />{" "}
              <div className="totals-item ">
                <h4>Total due</h4>
                <h4>
                  {`${currencySymbolGenerator(data?.eventCurrency)} ${(
                    parseFloat(totalPriceCalculated()) +
                    state?.orderAmountWithVat
                  ).toFixed(2)}`}
                </h4>
              </div>
            </div>
            <div className="legal-links-container">
              <Link to={"./"}>Terms</Link>
              <Link to={"./"}>Privacy</Link>
            </div>
          </div>
        </div>
        <div className="checkout-container-right">
          <div onClick={() => navigate(-1)} className="back-button">
            <ReactSVG src="/icons/tools/left-arrow.svg" />
            <p>Back</p>
          </div>
          <Checkout setCoupon={setCoupon} eventData={data} />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to={"/"} />
  );
};

export default CheckoutPage;
