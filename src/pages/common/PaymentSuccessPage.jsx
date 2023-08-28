import React from "react";
import "./PaymentStatusPage.scss";
import { useNavigate, Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import PrimaryButton from "../../components/UI/PrimaryButton";
import HeaderPlaceHolder from "../../components/Layouts/UserLayout/HeaderPlaceHolder";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const headline = "Congratulations!";
  const description =
    "You successfully have bought the ticket(s). Please enjoy your event. We have sent you an email with tickets and instructions.";
  const button = { text: "Continue Shopping", link: "/all-events" };
  const link = { text: "Back to Home", url: "/" };
  const icon = "/icons/tools/claps-success-status.svg";

  return (
    <>
      <HeaderPlaceHolder />
      <div className="payment-status-page">
        <ReactSVG className="status-icon" src={icon} />
        <div className="status-text-container">
          <h4>{headline}</h4>
          <p>{description}</p>
        </div>
        <PrimaryButton
          onClick={() => {
            navigate(button?.link);
          }}
          className="action-button"
        >
          {button.text}
        </PrimaryButton>
        <Link
          className="link-under-button"
          onClick={() => onCancel(false)}
          to={link.url}
        >
          {link?.text}
        </Link>
      </div>
    </>
  );
};

export default PaymentSuccessPage;
