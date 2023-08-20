import React, { useEffect, useState } from "react";
import "./AddSocialMedia.scss";
import CustomModal from "../../UI/CustomModal";
import PrimaryButton from "../../UI/PrimaryButton";
import useHandleOnBlur from "../../../hooks/useHandleOnBlur";
import validateAddNewSocialMedia from "../../../validation/AddSocialMedia";
import { usePutApi } from "../../../hooks/api-hooks/usePutApi";
import { useQueryClient } from "@tanstack/react-query";

const initialState = {
  platform: "",
  link: "",
};

const AddSocialMedia = ({
  showAddSocialMedia,
  setShowAddSocialMedia,
  initialStateForEditSocialMedia,
}) => {
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});

  const { handleMutation, isLoading: isProfileUpdating } = usePutApi();
  const queryClient = useQueryClient();

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    setFormValues(
      initialStateForEditSocialMedia?.platform !== ""
        ? initialStateForEditSocialMedia
        : initialState
    );
  }, [initialStateForEditSocialMedia]);

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateAddNewSocialMedia, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateAddNewSocialMedia(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    handleMutation(
      {
        path: "business/set-social-link",
        data: formValues,
      },
      (res) => {
        queryClient.invalidateQueries("get-profile");
        setShowAddSocialMedia(false);
        setFormValues(initialState);
      },
      (res) => {}
    );
  };
  return (
    <CustomModal
      onCancel={() => setShowAddSocialMedia(false)}
      open={showAddSocialMedia}
      onOk={() => setShowAddSocialMedia(false)}
      title={"Add Social Media"}
      subtitle={"Please enter the information to add social media."}
    >
      <form
        className="add-new-social-media-form-container"
        onSubmit={handleSubmit}
      >
        <div
          className={`single-form-item ${formErrors.platform ? "error" : ""}`}
        >
          <label htmlFor="platform">Social Media</label>
          <select
            onChange={handleInputChange}
            name="platform"
            id="platform"
            value={formValues.platform}
            onBlur={handleOnBlur}
          >
            <option value="">Choose one</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
          </select>
          {formErrors.platform && (
            <p className="select-error-message">{formErrors.platform}</p>
          )}
        </div>

        <div className={`single-form-item ${formErrors.link ? "error" : ""}`}>
          <label htmlFor="link">Link</label>
          <textarea
            name="link"
            type="text"
            id="link"
            placeholder="Link here..."
            onChange={handleInputChange}
            value={formValues.link}
            onBlur={handleOnBlur}
          />
          {formErrors.link && (
            <p className="error-message">{formErrors.link}</p>
          )}
        </div>
        <PrimaryButton className={"form-submit-button"}>Confirm</PrimaryButton>
      </form>
    </CustomModal>
  );
};

export default AddSocialMedia;
