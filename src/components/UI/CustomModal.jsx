import { Modal } from "antd";
import React from "react";
import { ReactSVG } from "react-svg";
import "./CustomModal.scss";

const CustomModal = ({
  open,
  onCancel,
  onOk,
  children,
  title,
  subtitle,
  width,
}) => {
  return (
    <Modal
      onCancel={onCancel}
      open={open}
      onOk={onOk}
      footer={[]}
      centered
      width={width}
      closeIcon={
        <ReactSVG className={"svg"} src="/icons/tools/cross-red.svg" />
      }
      maskClosable={false}
      style={{ marginBlock: "40px" }}
      title={
        <>
          <h2 className="custom-modal-title">{title}</h2>
          {subtitle && <p className="custom-modal-subtitle">{subtitle}</p>}
        </>
      }
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
