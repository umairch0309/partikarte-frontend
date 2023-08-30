import React, { useState } from "react";
import "./NewsCard.scss";
import { Link } from "react-router-dom";
import formatDate from "../../utilities/formatDate";

const NewsCard = ({ news, className }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`single-news-card ${className}`}>
      <div className="news-card-header">
        <p className="news-tag">News</p>
        <p>{formatDate(news?.date)}</p>
      </div>
      <h2>{news?.name}</h2>
      <p className={`news-description ${expanded ? "expanded" : ""}`}>
        {news?.description}
      </p>
      {news?.description?.length > 136 && (
        <div className="read-more-link-container">
          <Link className="read-more-link" to={`#`} onClick={toggleDescription}>
            {expanded ? "Read less" : "Read more"}
          </Link>
        </div>
      )}
    </div>
  );
};

export default NewsCard;
