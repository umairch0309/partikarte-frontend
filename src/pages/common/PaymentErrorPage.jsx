import React from "react";
import "./PaymentStatusPage.scss";
import { useNavigate, Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import PrimaryButton from "../../components/UI/PrimaryButton";
import HeaderPlaceHolder from "../../components/Layouts/UserLayout/HeaderPlaceHolder";

const PaymentErrorPage = () => {
  const navigate = useNavigate();
  const headline = "Oops!";
  const description =
    "You have an issue with the payment process which may cause because of payment method.";
  const button = { text: "Try again", link: "./" };
  const link = { text: "Contact Support", url: "/" };
  const icon = "/icons/tools/warning-error-status.svg";

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

export default PaymentErrorPage;
