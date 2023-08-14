import React, { useState } from "react";
import CustomModal from "../UI/CustomModal";
import "./DeleteAlert.scss";
import PrimaryButton from "../UI/PrimaryButton";

const DeleteAlert = ({
  showDeleteAlert,
  setShowDeleteAlert,
  selectedRecord,
}) => {
  // console.log(selectedRecord)
  return (
    <CustomModal
      onCancel={() => setShowDeleteAlert(false)}
      open={showDeleteAlert}
      onOk={() => setShowDeleteAlert(false)}
      title={"Delete Confirmation"}
      subtitle={"Are you sure you want to delete this member?"}
      // width={700}
    >
      <div className="delete-member-alert-buttons">
        <PrimaryButton onClick={() => setShowDeleteAlert(false)}>
          Cancel
        </PrimaryButton>
        <PrimaryButton
          className={"red-button"}
          onClick={() => setShowDeleteAlert(false)}
        >
          Confirm Delete
        </PrimaryButton>
      </div>
    </CustomModal>
  );
};

export default DeleteAlert;
