import React from "react";
import "./Galleries.scss";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../UI/SecondaryButton";
import { ReactSVG } from "react-svg";

const Galleries = () => {
  const DUMMY_GALLERIES = [
    {
      id: "1",
      name: "Summer Inductives",
      date: "Jul 20, 2022",
      images: [
        "/images/event-1.jpg",
        "/images/event-2.jpg",
        "/images/event-3.jpg",
      ],
    },
    {
      id: "2",
      name: "Summer Inductives",
      date: "Jul 20, 2022",
      images: [
        "/images/event-1.jpg",
        "/images/event-2.jpg",
        "/images/event-3.jpg",
      ],
    },
    {
      id: "3",
      name: "Summer Inductives",
      date: "Jul 20, 2022",
      images: [
        "/images/event-1.jpg",
        "/images/event-2.jpg",
        "/images/event-3.jpg",
      ],
    },
    {
      id: "4",
      name: "Summer Inductives",
      date: "Jul 20, 2022",
      images: [
        "/images/event-1.jpg",
        "/images/event-2.jpg",
        "/images/event-3.jpg",
      ],
    },
    {
      id: "5",
      name: "Summer Inductives",
      date: "Jul 20, 2022",
      images: [
        "/images/event-1.jpg",
        "/images/event-2.jpg",
        "/images/event-3.jpg",
      ],
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="galleries-main-container">
      <div className="galleries-header">
        <h3>Galleries</h3>
        <SecondaryButton>
          <ReactSVG src="/icons/tools/add-gallery.svg" />
          <span>Add New Gallery</span>
        </SecondaryButton>
      </div>
      <div className="galleries-main-bottom">
        {DUMMY_GALLERIES.map((gallery) => {
          return (
            <div
              onClick={() => navigate(`galleries/${gallery.id}`)}
              key={gallery.id}
              className="single-gallery-item"
            >
              <img
                src={
                  gallery.images[0] ? gallery.images[0] : "/images/event-1.jpg"
                }
              />
              <div className="single-gallery-item-bottom">
                <div className="side-by-side-info">
                  <h4>{gallery.name}</h4>
                  <h6>{gallery.images.length} images</h6>
                </div>
                <div className="side-by-side-info">
                  <p>{gallery.date}</p>
                  <ReactSVG src="/icons/tools/dots-action.svg" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Galleries;
