import React from "react";
import "./ViewGallery.scss";
import { Dropdown } from "antd";
import { ReactSVG } from "react-svg";

const ViewGallery = () => {
  const DUMMY_GALLERY = {
    id: "1",
    name: "Summer Inductives",
    date: "Jul 20, 2022",
    images: [
      "/images/business-profile.jpg",
      "/images/event-1.jpg",
      "/images/event-2.jpg",
      "/images/event-3.jpg",
    ],
  };
  const items = [
    // {
    //   label: (
    //     <div className="button-in-dropdown">
    //       <ReactSVG src="/icons/tools/edit.svg" />
    //       <span>Replace</span>
    //     </div>
    //   ),
    //   key: "0",
    //   className: "blue-button-dropdown",
    // },
    {
      label: (
        <div className="button-in-dropdown">
          <ReactSVG className="button-svg" src="/icons/tools/delete.svg" />
          <span>Delete</span>
        </div>
      ),
      key: "1",
      className: "red-button-dropdown",
    },
    {
      label: (
        <div className="button-in-dropdown">
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
      {DUMMY_GALLERY.images.map((image, index) => {
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
              <button className="dots-action-button">
                <ReactSVG
                  className="dots-action-svg"
                  src="/icons/tools/dots-action.svg"
                />
              </button>
            </Dropdown>
            {index === 0 && (
              <div className="gallery-preview">
                <p>Used as Gallery Preview</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ViewGallery;
