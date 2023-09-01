import React, { useState } from "react";
import "./Calculate.scss";
import { Switch } from "antd";

const Calculate = () => {
  const [price, setPrice] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [reservedSeating, setReservedSeating] = useState(false);

  // Calculate total earnings and Partikarte's fee
  const calculateEarnings = () => {
    const totalEarnings = price * tickets;
    const partikarteFee = totalEarnings * 0.08;
    return {
      totalEarnings: totalEarnings.toFixed(2),
      partikarteFee: partikarteFee.toFixed(2),
    };
  };

  // Handle price input change
  const handlePriceChange = (e) => {
    setPrice(parseFloat(e.target.value));
  };

  // Handle tickets input change
  const handleTicketsChange = (e) => {
    setTickets(parseInt(e.target.value));
  };

  // Handle reserved seating switch change
  const handleReservedSeatingChange = (checked) => {
    setReservedSeating(checked);
  };

  const { totalEarnings, partikarteFee } = calculateEarnings();

  return (
    <div className="calculate-earning-section">
      <div className="calculate-container">
        <div className="calculate-left">
          <h1>Calculate</h1>
          <select>
            <option>United States</option>
            <option>Slovakia</option>
            <option>United Kingdom</option>
          </select>
          <div className="left-main">
            <div className="left-main-input">
              <label>Price</label>
              <input
                type="number"
                min={0}
                placeholder="Price"
                value={price}
                onChange={handlePriceChange}
              />
            </div>
            <span>X</span>
            <div className="left-main-input">
              <label>Tickets</label>
              <input
                type="number"
                min={0}
                placeholder="Tickets"
                value={tickets}
                onChange={handleTicketsChange}
              />
            </div>
          </div>
          <div className="reserve-seating">
            <Switch
              id="reservedSeating"
              checked={reservedSeating}
              onChange={handleReservedSeatingChange}
            />
            <label htmlFor="reservedSeating">
              My event has reserved seating
            </label>
          </div>
        </div>
        <div className="calculate-right">
          <h5>Your Earnings:</h5>
          <h1>{`${totalEarnings} USD`}</h1>
          <div className="right-main">
            <div className="main-item">
              <h5>Attendees Pay</h5>
              <h5 className="amount">{`${totalEarnings} USD`}</h5>
            </div>
            <div className="main-item">
              <h5>Partikarte’s Fee</h5>
              <h5 className="amount">{`${partikarteFee} USD`}</h5>
            </div>
            <p>Includes all payment fee’s, VAT is not applicable.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculate;
