import React from "react";
import "./NewsCard.scss";
import { Link } from "react-router-dom";

const NewsCard = ({ news, className }) => {
  return (
    <div className={`single-news-card ${className}`}>
      <div className="news-card-header">
        <p className="news-tag">{news.tag}</p>
        <p>{news.date}</p>
      </div>
      <h2>{news.title}</h2>
      <p className="news-description">{news.description}</p>
      <div className="read-more-link-container">
        <Link className="read-more-link" to={"/all-news/1"}>
          Read more
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
