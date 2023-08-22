import React, { useState } from "react";
import "./ViewGallery.scss";
import { Dropdown, Skeleton } from "antd";
import { ReactSVG } from "react-svg";
import { useParams } from "react-router-dom";
import { useGetSingleGallery } from "../../../api/organizer-settings";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteApi } from "../../../hooks/api-hooks/useDeleteApi";
import { usePatchApi } from "../../../hooks/api-hooks/usePatchApi";

const ViewGallery = () => {
  const [data, setData] = useState();
  const { galleryId } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);

  const { isLoading } = useGetSingleGallery(galleryId, (res) => {
    setData(res?.gallery);
  });

  const { handleMutation, isLoading: isDeleting } = useDeleteApi();
  const { handleMutation: patchMutation, isLoading: isUpdating } =
    usePatchApi();

  const queryClient = useQueryClient();

  const handleDelete = () => {
    handleMutation(
      {
        path: `business/gallery/${galleryId}/image/${selectedImage}`,
      },
      (res) => {
        queryClient.invalidateQueries(galleryId);
        setSelectedImage(null);
      },
      (res) => {}
    );
  };

  const handleSetPreview = () => {
    patchMutation(
      {
        path: `business/gallery/${galleryId}/image/${selectedImage}`,
      },
      (res) => {
        queryClient.invalidateQueries(galleryId);
        setSelectedImage(null);
      },
      (res) => {}
    );
  };

  const items = [
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
    {
      label: (
        <div onClick={handleSetPreview} className="button-in-dropdown">
          <ReactSVG className="button-svg" src="/icons/tools/crown.svg" />
          <span>Mark as preview</span>
        </div>
      ),
      key: "2",
      className: "purple-button-dropdown",
    },
  ];

  return (
    <div className="view-gallery-main-container">
      {isLoading ? (
        <Skeleton active={true} paragraph={{ rows: 5 }} size={"small"} />
      ) : (
        data?.images?.map((image, index) => {
          return (
            <div className="single-gallery-image-item">
              <img src={image} />
              <Dropdown
                menu={{
                  items,
                }}
                trigger={["click"]}
                placement="bottomRight"
                className="dropdown-view-gallery-actions"
              >
                <button
                  onClick={() => setSelectedImage(index)}
                  className="dots-action-button"
                >
                  <ReactSVG
                    className="dots-action-svg"
                    src="/icons/tools/dots-action.svg"
                  />
                </button>
              </Dropdown>
              {index === data?.galleryPreview && (
                <div className="gallery-preview">
                  <p>Used as Gallery Preview</p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ViewGallery;
