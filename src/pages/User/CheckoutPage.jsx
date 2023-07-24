import React from "react";
import { ReactSVG } from "react-svg";
import "./CheckoutPage.scss";
import HeaderPlaceHolder from "../../components/Layouts/UserLayout/HeaderPlaceHolder";
import CheckoutSelectedEvent from "../../components/Common/CheckoutSelectedEvent";
import { useState } from "react";
import { useEffect } from "react";
import Checkout from "../../components/Common/Checkout";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const DUMMY_EVENTS = [
    {
      image: "/images/event-1.jpg",
      title: "Some Event Name",
      quantity: 2,
      price: 50,
    },
    {
      image: "/images/event-1.jpg",
      title: "Some Event Name",
      quantity: 2,
      price: 50,
    },
    {
      image: "/images/event-1.jpg",
      title: "Some Event Name",
      quantity: 2,
      price: 50,
    },
  ];
  const [totalPrice, setTotalPrice] = useState(300);

  return (
    <div className="checkout-payment-page">
      <HeaderPlaceHolder />
      <div className="checkout-payment-main-container">
        <div className="checkout-container-left">
          <div className="back-button">
            <ReactSVG src="/icons/tools/left-arrow.svg" />
            <p>Back</p>
          </div>
          <div className="checkout-left-main">
            <h5>Total Amount</h5>
            <h1>$ {totalPrice.toFixed(2)}</h1>
            <div className="selected-tickets-container">
              {DUMMY_EVENTS.map((event, index) => {
                return (
                  <CheckoutSelectedEvent
                    key={index}
                    eventTicket={event}
                    setTotalPrice={setTotalPrice}
                    totalPrice={totalPrice}
                  />
                );
              })}
            </div>
            <div className="totals-container">
              <div className="totals-item">
                <h4>Subtotal</h4>
                <h4>$ {totalPrice.toFixed(2)}</h4>
              </div>
              <hr />{" "}
              <div className="totals-item tax-item">
                <h4>Sales tax (6.5%)</h4>
                <h4>$ {(totalPrice * 0.065).toFixed(2)}</h4>
              </div>
              <hr />{" "}
              <div className="totals-item ">
                <h4>Total due</h4>
                <h4>$ {(totalPrice + totalPrice * 0.065).toFixed(2)}</h4>
              </div>
            </div>
            <div className="legal-links-container">
              <Link to={"./"}>Terms</Link>
              <Link to={"./"}>Privacy</Link>
            </div>
          </div>
        </div>
        <div className="checkout-container-right">
          <div className="back-button">
            <ReactSVG src="/icons/tools/left-arrow.svg" />
            <p>Back</p>
          </div>
          <Checkout totalPrice={totalPrice} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
