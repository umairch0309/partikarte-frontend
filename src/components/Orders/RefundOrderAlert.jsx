import React, { useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./RefundOrderAlert.scss";
import PrimaryButton from "../UI/PrimaryButton";
import { useQueryClient } from "@tanstack/react-query";
import { usePutApi } from "../../hooks/api-hooks/usePutApi";

const RefundOrderAlert = ({
  showRefundAlert,
  setShowRefundAlert,
  selectedRecord,
}) => {
  const { isLoading, handleMutation } = usePutApi();

  const queryClient = useQueryClient();

  const refundOrder = () => {
    handleMutation(
      {
        path: `orders/refund-order/${selectedRecord?._id}`,
      },
      (res) => {
        queryClient.invalidateQueries([selectedRecord?.businessId]);
        setShowRefundAlert(false);
      }
    );
  };

  return (
    <CustomModal
      onCancel={() => setShowRefundAlert(false)}
      open={showRefundAlert}
      onOk={() => setShowRefundAlert(false)}
      title={"Refund Order?"}
      subtitle={
        "You can refund the customer up to the amount they spent on their purchase."
      }
      // width={700}
    >
      <div className="refund-order-alert-container">
        <div className="alert-main">
          <p>Refund the following amount:</p>
          <h3>${selectedRecord?.orderAmount}</h3>
        </div>
        <div className="alert-buttons">
          <PrimaryButton onClick={() => setShowRefundAlert(false)}>
            Cancel
          </PrimaryButton>
          <PrimaryButton className={"red-button"} onClick={refundOrder}>
            Confirm Refund
          </PrimaryButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default RefundOrderAlert;
