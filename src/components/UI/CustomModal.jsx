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
      footer={null}
      centered
      width={width || undefined}
      destroyOnHidden
      closeIcon={
        <ReactSVG className={"svg"} src="/icons/tools/cross-red.svg" />
      }
      maskClosable={false}
      styles={{ wrapper: { marginBlock: "40px" } }}
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
