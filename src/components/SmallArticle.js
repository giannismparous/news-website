import React from 'react';
import '../styles/Article.css'; // Import your CSS file
import { Link } from 'react-router-dom';

const SmallArticle = ({ id, title, category, date, imagePath }) => {

// Default date value if date is undefined
const displayDate = date ? date : "24/6/2024 | 13:00";

  return (
    <div className="small-article-container">
      <Link to={`/articles/${id}`} classNa
      me="article-link">
      {imagePath && <img src={imagePath} alt={title} className="article-image" />}
      </Link>
      <div className="article-details">
      <Link to={`/articles/${id}`} className="article-link">
        <p className="article-category"><em>{category} | {displayDate}</em></p>
        <h2 className="article-title">{title}</h2>
      </Link>
      </div>
    </div>
  );
};

export default SmallArticle;
