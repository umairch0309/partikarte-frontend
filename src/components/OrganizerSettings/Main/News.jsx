import React, { useState } from "react";
import "./News.scss";
import SecondaryButton from "../../UI/SecondaryButton";
import { ReactSVG } from "react-svg";
import { Dropdown, Skeleton } from "antd";
import AddNews from "../Forms/AddNews";
import { useGetAllNews } from "../../../api/organizer-settings";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteApi } from "../../../hooks/api-hooks/useDeleteApi";

const News = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedNewsStatus, setSelectedNewsStatus] = useState(false);

  const { handleMutation, isLoading: isNewsDeleting } = useDeleteApi();
  const queryClient = useQueryClient();

  const { isLoading } = useGetAllNews((res) => {
    setNews(Array.isArray(res?.news) ? res.news : []);
  });

  const [showAddNewsModal, setShowAddNewsModal] = useState(false);

  const handleDelete = () => {
    handleMutation(
      {
        path: `news/delete-news/${selectedNews?._id}`,
      },
      (res) => {
        console.log("sucess delted");
        queryClient.invalidateQueries("get-all-news");
        setSelectedNews(null);
      },
      (res) => {
        console.log("error delted");
      }
    );
  };

  const items = [
    {
      label: (
        <div
          onClick={() => {
            setSelectedNewsStatus(true);
            setShowAddNewsModal(true);
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
    <div className="news-main-container">
      <div className="news-header">
        <h3>News</h3>
        <SecondaryButton onClick={() => setShowAddNewsModal(true)}>
          <ReactSVG src="/icons/tools/add-gallery.svg" />
          <span>Add new News</span>
        </SecondaryButton>
      </div>
      <div className="news-main-bottom">
        {isLoading ? (
          <Skeleton active={true} paragraph={{ rows: 5 }} size={"small"} />
        ) : news.length > 0 ? (
          news.map((newsItem) => (
            <div className="single-news-container" key={newsItem?._id}>
              <div className="container-left">
                <img
                  src={newsItem?.images?.[0] || "/images/event-1.jpg"}
                  alt={newsItem?.name}
                />
                <div className="news-info-container">
                  <p>
                    {newsItem?.date
                      ? new Date(newsItem.date).toLocaleString()
                      : ""}
                  </p>
                  <h4>{newsItem?.name}</h4>
                  <h6>{newsItem?.description}</h6>
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
                  <button
                    onClick={() => setSelectedNews(newsItem)}
                    className="dots-action-button"
                  >
                    <ReactSVG
                      className="dots-action-svg"
                      src="/icons/tools/dots-action.svg"
                    />
                  </button>
                </Dropdown>
              </div>
            </div>
          ))
        ) : (
          <p>No news yet.</p>
        )}
      </div>
      {showAddNewsModal && (
        <AddNews
          setShowAddNewsModal={setShowAddNewsModal}
          showAddNewsModal={showAddNewsModal}
          selectedNews={selectedNews}
          setSelectedNewsStatus={setSelectedNewsStatus}
          selectedNewsStatus={selectedNewsStatus}
        />
      )}
    </div>
  );
};

export default News;
