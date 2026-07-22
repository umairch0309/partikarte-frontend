import React, { useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./RefundOrderAlert.scss";
import PrimaryButton from "../UI/PrimaryButton";
import { usePostApi } from "../../hooks/api-hooks/usePostApi";
import { useQueryClient } from "@tanstack/react-query";

const RefundOrderAlert = ({
  showRefundAlert,
  setShowRefundAlert,
  selectedRecord,
}) => {
  const [refundApplicationFee, setRefundApplicationFee] = useState(true);
  const { handleMutation, isLoading } = usePostApi();
  const queryClient = useQueryClient();

  const remaining =
    (selectedRecord?.orderAmount || 0) - (selectedRecord?.refundedAmount || 0);

  const confirmRefund = () => {
    if (!selectedRecord?._id) {
      setShowRefundAlert(false);
      return;
    }

    handleMutation(
      {
        path: `stripe/refund/${selectedRecord._id}`,
        data: {
          refundApplicationFee,
        },
      },
      () => {
        queryClient.invalidateQueries();
        setShowRefundAlert(false);
      },
      () => {}
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
    >
      <div className="refund-order-alert-container">
        <div className="alert-main">
          <p>Refund the following amount:</p>
          <h3>
            {selectedRecord?.currency || "EUR"} {remaining.toFixed(2)}
          </h3>
          {selectedRecord?.refundStatus &&
            selectedRecord.refundStatus !== "none" && (
              <p>
                Already refunded: {selectedRecord.refundedAmount || 0} (
                {selectedRecord.refundStatus})
              </p>
            )}
          <label className="refund-fee-toggle">
            <input
              type="checkbox"
              checked={refundApplicationFee}
              onChange={(e) => setRefundApplicationFee(e.target.checked)}
            />
            Also refund Partikarte’s 8% platform fee
          </label>
        </div>
        <div className="alert-buttons">
          <PrimaryButton
            disabled={isLoading}
            onClick={() => setShowRefundAlert(false)}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton
            className={"red-button"}
            disabled={isLoading || remaining <= 0}
            onClick={confirmRefund}
          >
            Confirm Refund
          </PrimaryButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default RefundOrderAlert;
