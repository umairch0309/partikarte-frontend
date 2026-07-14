import React, { useEffect, useState } from "react";
import "./AddGalleryModal.scss";
import CustomModal from "../../UI/CustomModal";
import "./AddGalleryModal.scss";
import useIsMobileWidth from "../../../hooks/useIsMobileWidth";
import PrimaryButton from "../../UI/PrimaryButton";
import useHandleOnBlur from "../../../hooks/useHandleOnBlur";
import validateAddNewGallery from "../../../validation/AddNewGallery";
import { useAllEvents } from "../../../api/manage-events";
import { useQueryClient } from "@tanstack/react-query";
import { usePostApi } from "../../../hooks/api-hooks/usePostApi";
import { usePutApi } from "../../../hooks/api-hooks/usePutApi";
import DateTimeLocalConverter from "../../../utilities/DateTimeLocalConverter";

const initialState = {
  galleryTitle: "",
  startingDate: "",
  event: "",
  galleryImages: [],
};

const AddGalleryModal = ({
  showAddGalleryModal,
  setShowAddGalleryModal,
  selectedGallery,
  setSelectedGalleryStatus,
  selectedGalleryStatus,
}) => {
  const isMobile = useIsMobileWidth();
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [imagesArray, setImagesArray] = useState([]);
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    if (selectedGallery && selectedGalleryStatus) {
      setFormValues({
        galleryTitle: selectedGallery?.name,
        event: selectedGallery?.event,
        startingDate: DateTimeLocalConverter(selectedGallery?.startingDate),
        galleryImages: selectedGallery?.images || [],
      });
    }
  }, [selectedGallery, selectedGalleryStatus]);

  const { isLoading: isEventsLoading } = useAllEvents((res) => {
    setEventsData(Array.isArray(res?.events) ? res.events : []);
  });

  const { handleMutation, isLoading: isNewsUpdating } = usePutApi();
  const queryClient = useQueryClient();

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormValues((prevState) => ({
          ...formValues,
          galleryImages: [...prevState.galleryImages, event.target.result],
        }));
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
    useHandleOnBlur(e, validateAddNewGallery, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateAddNewGallery(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("galleryName", formValues.galleryTitle);
    formData.append("event", formValues.event);
    formData.append("date", new Date().toISOString());
    imagesArray.map((image, index) => {
      formData.append(`newImages${index}`, image);
    });

    if (selectedGallery?.images && selectedGalleryStatus) {
      selectedGallery?.images?.forEach((image) => {
        formData.append("images[]", image);
      });
    }

    setFormErrors({});

    if (selectedGallery?._id && selectedGalleryStatus) {
      handleMutation(
        {
          path: `business/gallery/update/${selectedGallery?._id}`,
          data: formData,
        },
        (res) => {
          queryClient.invalidateQueries("get-all-galleries");
          setFormValues(initialState);
          setImagesArray([]);
          setShowAddGalleryModal(false);
          setSelectedGalleryStatus(false);
        },
        (res) => {}
      );
    } else {
      handleMutation(
        {
          path: "business/gallery/add",
          data: formData,
        },
        (res) => {
          queryClient.invalidateQueries("get-all-galleries");
          setFormValues(initialState);
          setImagesArray([]);
          setShowAddGalleryModal(false);
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
        setShowAddGalleryModal(false);
        setSelectedGalleryStatus(false);
      }}
      open={showAddGalleryModal}
      onOk={() => setShowAddGalleryModal(false)}
      title={`${
        selectedGallery?._id && selectedGalleryStatus ? "Edit" : "Add"
      } Gallery`}
      subtitle={"Please enter the information to add Gallery"}
      width={!isMobile && 700}
    >
      <form className="add-new-gallery-form-container" onSubmit={handleSubmit}>
        <div className="add-new-gallery-header">
          <div className="new-gallery-header-left">
            <label
              htmlFor="upload-gallery-banner"
              className={`gallery-banner-placeholder-box ${
                formErrors.galleryImages ? "image-error" : ""
              }`}
            >
              Click to upload
            </label>
            <input
              id="upload-gallery-banner"
              className="image-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <div className="new-gallery-header-right">
            {formValues?.galleryImages?.length > 0 &&
              formValues.galleryImages.map((el) => <img src={el} />)}
          </div>
        </div>
        {formErrors.galleryImages && (
          <p className="image-error-message">{formErrors.galleryImages}</p>
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

        {/* <div
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
        </div> */}

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

export default AddGalleryModal;
