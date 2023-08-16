import React, { useState } from "react";
import "./AddNews.scss";
import CustomModal from "../../UI/CustomModal";
import useIsMobileWidth from "../../../hooks/useIsMobileWidth";
import PrimaryButton from "../../UI/PrimaryButton";
import useHandleOnBlur from "../../../hooks/useHandleOnBlur";
import validateAddNews from "../../../validation/AddNews";

const initialState = {
  galleryTitle: "",
  startingDate: "",
  event: "",
  newsImages: [],
};

const AddNews = ({ showAddNewsModal, setShowAddNewsModal }) => {
  const isMobile = useIsMobileWidth();
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [imagesArray, setImagesArray] = useState([]);

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormValues((prevState) => ({
          ...formValues,
          newsImages: [...prevState.newsImages, event.target.result],
        }));
      };
      reader.readAsDataURL(imageFile);
      setImagesArray([...imagesArray, imageFile]);
    }
  };

  console.log(formValues.newsImages);

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
      onCancel={() => setShowAddNewsModal(false)}
      open={showAddNewsModal}
      onOk={() => setShowAddNewsModal(false)}
      title={"Add News"}
      subtitle={"Please enter the information to add News"}
      width={!isMobile && 700}
    >
      <form className="add-new-news-form-container" onSubmit={handleSubmit}>
        <div className="add-new-news-header">
          <div className="new-news-header-left">
            <label
              htmlFor="upload-news-banner"
              className={`news-banner-placeholder-box ${
                formErrors.newsImages ? "image-error" : ""
              }`}
            >
              Click to upload
            </label>
            <input
              id="upload-news-banner"
              className="image-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <div className="new-news-header-right">
            {formValues?.newsImages?.length > 0 &&
              formValues.newsImages.map((el) => <img src={el} />)}
          </div>
        </div>
        {formErrors.newsImages && (
          <p className="image-error-message">{formErrors.newsImages}</p>
        )}
        <div
          className={`single-form-item ${
            formErrors.galleryTitle ? "error" : ""
          }`}
        >
          <label htmlFor="galleryTitle">Gallery title</label>
          <input
            name="galleryTitle"
            type="text"
            id="galleryTitle"
            placeholder="Gallery title"
            onChange={handleInputChange}
            value={formValues.galleryTitle}
            onBlur={handleOnBlur}
          />
          {formErrors.galleryTitle && (
            <p className="error-message">{formErrors.galleryTitle}</p>
          )}
        </div>

        <div
          className={`single-form-item ${
            formErrors.description ? "error" : ""
          }`}
        >
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            type="text"
            id="description"
            placeholder="Description"
            onChange={handleInputChange}
            value={formValues.description}
            onBlur={handleOnBlur}
          />
          {formErrors.description && (
            <p className="error-message">{formErrors.description}</p>
          )}
        </div>

        <div
          className={`single-form-item ${
            formErrors.startingDate ? "error" : ""
          }`}
        >
          <label htmlFor="startingDate">Starting (Date-Time)</label>
          <input
            name="startingDate"
            type="datetime-local"
            id="startingDate"
            placeholder="Select date and time..."
            onChange={handleInputChange}
            value={formValues.startingDate}
            onBlur={handleOnBlur}
          />

          {formErrors.startingDate && (
            <p className="select-error-message">{formErrors.startingDate}</p>
          )}
        </div>

        <div className={`single-form-item ${formErrors.event ? "error" : ""}`}>
          <label htmlFor="event">Event</label>
          <select
            onChange={handleInputChange}
            name="event"
            id="event"
            value={formValues.event}
            onBlur={handleOnBlur}
          >
            <option value="">Choose event</option>
            <option value="event0">Event 1</option>
            <option value="event1">Event 2</option>
            <option value="event2">Event 3</option>
          </select>
          {formErrors.event && (
            <p className="select-error-message">{formErrors.event}</p>
          )}
        </div>

        <div className="side-by-side-guest-input">
          <PrimaryButton className={"form-submit-button"}>
            Confirm
          </PrimaryButton>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddNews;
