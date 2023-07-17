import React from "react";
import { Modal } from "antd";
import { ReactSVG } from "react-svg";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "./PrimaryButton";

import "./StatusModal.scss";

const StatusModal = ({
  open,
  onCancel,
  headline,
  description,
  button,
  link,
  icon,
}) => {
  const navigate = useNavigate();
  return (
    <Modal
      open={open}
      onCancel={() => onCancel(false)}
      closable={false}
      footer={[]}
      centered
      maskClosable={false}
      className="action-status-modal"
    >
      <div className="status-modal-container">
        <ReactSVG src={icon} />
        <div className="status-text-container">
          <h4>{headline}</h4>
          <p>{description}</p>
        </div>
        <PrimaryButton
          onClick={() => {
            onCancel(false);
            navigate(button?.link);
          }}
          className="action-button"
        >
          {button.text}
        </PrimaryButton>
        <Link className="link-under-button" to={link.url}>
          {link?.text}
        </Link>
      </div>
    </Modal>
  );
};

export default StatusModal;
