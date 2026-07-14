import React, { useEffect, useState } from "react";
import "./AddNews.scss";
import CustomModal from "../../UI/CustomModal";
import useIsMobileWidth from "../../../hooks/useIsMobileWidth";
import PrimaryButton from "../../UI/PrimaryButton";
import useHandleOnBlur from "../../../hooks/useHandleOnBlur";
import validateAddNews from "../../../validation/AddNews";
import { useAllEvents } from "../../../api/manage-events";
import { useQueryClient } from "@tanstack/react-query";
import { usePostApi } from "../../../hooks/api-hooks/usePostApi";
import DateTimeLocalConverter from "../../../utilities/DateTimeLocalConverter";
import { usePutApi } from "../../../hooks/api-hooks/usePutApi";

const initialState = {
  name: "",
  startingDate: "",
  event: "",
  newsImages: [],
  description: "",
};

const AddNews = ({
  showAddNewsModal,
  setShowAddNewsModal,
  selectedNews,
  setSelectedNewsStatus,
  selectedNewsStatus,
}) => {
  const isMobile = useIsMobileWidth();
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [imagesArray, setImagesArray] = useState([]);
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    if (selectedNews && selectedNewsStatus) {
      setFormValues({
        ...selectedNews,
        startingDate: DateTimeLocalConverter(selectedNews?.date),
        newsImages: selectedNews?.images || [],
        event: selectedNews?.eventId,
      });
    }
  }, [selectedNews, selectedNewsStatus]);

  const { isLoading: isEventsLoading } = useAllEvents((res) => {
    setEventsData(Array.isArray(res?.events) ? res.events : []);
  });

  const { handleMutation, isLoading: isNewsCreating } = usePostApi();
  const { handleMutation: handleUpdate, isLoading: isNewsUpdating } =
    usePutApi();

  const queryClient = useQueryClient();

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormValues((prevState) => ({
          ...formValues,
          newsImages: [...prevState.newsImages, event.target.result],
        }));
        useHandleOnBlur(
          {
            target: {
              name: "newsImages",
              value: [...formValues.newsImages, event.target.result],
            },
          },
          validateAddNews,
          setFormErrors
        );
      };
      reader.readAsDataURL(imageFile);
      setImagesArray([...imagesArray, imageFile]);
    }
  };

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
    formData.append("eventId", formValues.event);
    formData.append("date", new Date().toISOString());
    formData.append("description", formValues.description);
    if (selectedNews?.images && selectedNewsStatus) {
      selectedNews?.images?.forEach((image) => {
        formData.append("images[]", image);
      });
    }

    imagesArray.map((image, index) => {
      formData.append(`newImages${index}`, image);
    });

    setFormErrors({});

    if (selectedNews?._id && selectedNewsStatus) {
      handleUpdate(
        {
          path: `news/update-news/${selectedNews?._id}`,
          data: formData,
        },
        (res) => {
          queryClient.invalidateQueries("get-all-news");
          setFormValues(initialState);
          setImagesArray([]);
          setShowAddNewsModal(false);
          setSelectedNewsStatus(false);
        },
        (res) => {}
      );
    } else {
      handleMutation(
        {
          path: "news/create-news",
          data: formData,
        },
        (res) => {
          queryClient.invalidateQueries("get-all-news");
          setFormValues(initialState);
          setImagesArray([]);
          setShowAddNewsModal(false);
        },
        (res) => {}
      );
    }
  };
  return (
    <CustomModal
      onCancel={() => {
        setFormValues(initialState);
        setFormErrors({});
        setImagesArray([]);
        setShowAddNewsModal(false);
        setSelectedNewsStatus(false);
      }}
      open={showAddNewsModal}
      onOk={() => setShowAddNewsModal(false)}
      title={`${
        selectedNews?._id && selectedNewsStatus ? "Edit " : "Add"
      } News`}
      subtitle={`Please enter the information to ${
        selectedNews?._id && selectedNewsStatus ? "edit" : "add"
      } News`}
      width={!isMobile && 700}
    >
      <form className="add-new-news-form-container" onSubmit={handleSubmit}>
        {/* <div className="add-new-news-header">
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
        </div> */}
        {formErrors.newsImages && (
          <p className="image-error-message">{formErrors.newsImages}</p>
        )}
        <div className={`single-form-item ${formErrors.name ? "error" : ""}`}>
          <label htmlFor="name">Name</label>
          <input
            name="name"
            type="text"
            id="name"
            placeholder="Name"
            onChange={handleInputChange}
            value={formValues.name}
            onBlur={handleOnBlur}
          />
          {formErrors.name && (
            <p className="error-message">{formErrors.name}</p>
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
            <option value="no-specific-event">No specific event.</option>

            {eventsData?.length > 0 &&
              eventsData?.map((el) => (
                <option value={el?._id}>{el?.eventName}</option>
              ))}
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
