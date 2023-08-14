import React from "react";
import "./News.scss";
import SecondaryButton from "../../UI/SecondaryButton";
import { ReactSVG } from "react-svg";
import { Dropdown } from "antd";

const News = () => {
  const items = [
    {
      label: (
        <div className="button-in-dropdown">
          <ReactSVG src="/icons/tools/edit.svg" />
          <span>Edit</span>
        </div>
      ),
      key: "0",
      className: "blue-button-dropdown",
    },
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
  ];

  const newsData = [
    {
      date: "Jul 20, 2022",
      title:
        "Consectures Dummy Content Velit officia consequat duis enim velit mollit",
      description:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit xercitation veniam consequat sunt nostrud amet. Velit officia consequat duis enim velit mollit xercitation veniam consequat sunt nostrud amet",
      imageSrc: "/images/event-1.jpg",
    },
    {
      date: "Jul 20, 2022",
      title:
        "Consectures Dummy Content Velit officia consequat duis enim velit mollit",
      description:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit xercitation veniam consequat sunt nostrud amet. Velit officia consequat duis enim velit mollit xercitation veniam consequat sunt nostrud amet",
      imageSrc: "/images/event-2.jpg",
    },
    {
      date: "Jul 20, 2022",
      title:
        "Consectures Dummy Content Velit officia consequat duis enim velit mollit",
      description:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit xercitation veniam consequat sunt nostrud amet. Velit officia consequat duis enim velit mollit xercitation veniam consequat sunt nostrud amet",
      imageSrc: "/images/event-3.jpg",
    },
    {
      date: "Jul 20, 2022",
      title:
        "Consectures Dummy Content Velit officia consequat duis enim velit mollit",
      description:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit xercitation veniam consequat sunt nostrud amet. Velit officia consequat duis enim velit mollit xercitation veniam consequat sunt nostrud amet",
      imageSrc: "/images/event-1.jpg",
    },
    {
      date: "Jul 20, 2022",
      title:
        "Consectures Dummy Content Velit officia consequat duis enim velit mollit",
      description:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit xercitation veniam consequat sunt nostrud amet. Velit officia consequat duis enim velit mollit xercitation veniam consequat sunt nostrud amet",
      imageSrc: "/images/event-3.jpg",
    },
  ];

  return (
    <div className="news-main-container">
      <div className="news-header">
        <h3>News</h3>
        <SecondaryButton>
          <ReactSVG src="/icons/tools/add-gallery.svg" />
          <span>Add new News</span>
        </SecondaryButton>
      </div>
      <div className="news-main-bottom">
        {newsData.map((newsItem, index) => (
          <div className="single-news-container" key={index}>
            <div className="container-left">
              <img src={newsItem.imageSrc} alt={`News ${index + 1}`} />
              <div className="news-info-container">
                <p>{newsItem.date}</p>
                <h4>{newsItem.title}</h4>
                <h6>{newsItem.description}</h6>
              </div>
            </div>
            <div className="container-right">
              <Dropdown
                menu={{
                  items: items,
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
