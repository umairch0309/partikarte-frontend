import React, { useState } from "react";
import "./Galleries.scss";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../UI/SecondaryButton";
import { ReactSVG } from "react-svg";
import AddGalleryModal from "../Forms/AddGalleryModal";
import { useGetAllGalleries } from "../../../api/organizer-settings";
import { Dropdown, Skeleton } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteApi } from "../../../hooks/api-hooks/useDeleteApi";

const Galleries = () => {
  const [galleries, setGalleries] = useState([]);
  const navigate = useNavigate();
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [selectedGalleryStatus, setSelectedGalleryStatus] = useState(false);

  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);

  const { isLoading } = useGetAllGalleries((res) => {
    setGalleries(res?.gallery);
  });

  const { handleMutation, isLoading: isDeleting } = useDeleteApi();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    handleMutation(
      {
        path: `business/gallery/${selectedGallery?._id}`,
      },
      (res) => {
        queryClient.invalidateQueries("get-all-galleries");
        setSelectedGallery(null);
      },
      (res) => {}
    );
  };

  const items = [
    {
      label: (
        <div
          onClick={() => {
            setSelectedGalleryStatus(true);
            setShowAddGalleryModal(true);
          }}
          className="button-in-dropdown"
        >
          <ReactSVG src="/icons/tools/edit.svg" />
          <span>Edit</span>
        </div>
      ),
      key: "0",
      className: "blue-button-dropdown",
    },
    {
      label: (
        <div onClick={handleDelete} className="button-in-dropdown">
          <ReactSVG className="button-svg" src="/icons/tools/delete.svg" />
          <span>Delete</span>
        </div>
      ),
      key: "1",
      className: "red-button-dropdown",
    },
  ];

  return (
    <div className="galleries-main-container">
      <div className="galleries-header">
        <h3>Galleries</h3>
        <SecondaryButton onClick={() => setShowAddGalleryModal(true)}>
          <ReactSVG src="/icons/tools/add-gallery.svg" />
          <span>Add New Gallery</span>
        </SecondaryButton>
      </div>
      <div className="galleries-main-bottom">
        {isLoading ? (
          <Skeleton active={true} paragraph={{ rows: 5 }} size={"small"} />
        ) : (
          galleries.map((gallery) => {
            return (
              <div key={gallery.id} className="single-gallery-item">
                <img
                  src={
                    gallery.images[gallery?.galleryPreview]
                      ? gallery.images[gallery?.galleryPreview]
                      : "/images/event-1.jpg"
                  }
                />
                <div className="single-gallery-item-bottom">
                  <div className="side-by-side-info">
                    <h4 onClick={() => navigate(`galleries/${gallery._id}`)}>
                      {gallery.name}
                    </h4>
                    <h6>{gallery.images.length} images</h6>
                  </div>
                  <div className="side-by-side-info">
                    <p>{new Date(gallery.startingDate).toLocaleString()}</p>
                    <Dropdown
                      menu={{
                        items,
                      }}
                      trigger={["click"]}
                      placement="bottomRight"
                      className="dropdown-view-gallery-actions"
                    >
                      <ReactSVG
                        onClick={() => setSelectedGallery(gallery)}
                        className="dots-action"
                        src="/icons/tools/dots-action.svg"
                      />
                    </Dropdown>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <AddGalleryModal
        showAddGalleryModal={showAddGalleryModal}
        setShowAddGalleryModal={setShowAddGalleryModal}
        selectedGallery={selectedGallery}
        selectedGalleryStatus={selectedGalleryStatus}
        setSelectedGalleryStatus={setSelectedGalleryStatus}
      />
    </div>
  );
};

export default Galleries;
