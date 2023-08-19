import React, { useState } from "react";
import "./AddSocialMedia.scss";
import CustomModal from "../../UI/CustomModal";
import PrimaryButton from "../../UI/PrimaryButton";
import useHandleOnBlur from "../../../hooks/useHandleOnBlur";
import validateAddNews from "../../../validation/AddNews";

const initialState = {
  name: "",
  link: "",
};

const AddSocialMedia = ({ showAddSocialMedia, setShowAddSocialMedia }) => {
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleOnBlur = async (e) => {
    useHandleOnBlur(e, validateAddNews, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateAddNews(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("name", formValues.name);
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
        <div className={`single-form-item ${formErrors.name ? "error" : ""}`}>
          <label htmlFor="name">Social Media</label>
          <select
            onChange={handleInputChange}
            name="name"
            id="name"
            value={formValues.name}
            onBlur={handleOnBlur}
          >
            <option value="">Choose one</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
          </select>
          {formErrors.name && (
            <p className="select-error-message">{formErrors.name}</p>
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
