import React from 'react';
import '../styles/Article.css'; // Import your CSS file

const Article = ({ id, title, content, category, imagePath, showContent = true }) => {
  const maxLength = 800;
  const displayContent = content.length > maxLength ? `${content.substring(0, maxLength)}...` : content;
  const showMore = content.length > maxLength;

  return (
    <div className="article">
      <h2>{title}</h2>
      {imagePath && <img src={imagePath} alt={title} className="article-image" />}
      <p><em>Κατηγορία: {category}</em></p>
      {showContent && (
        <div>
          {displayContent} {showMore && <span className="read-more">Περισσότερα...</span>}
        </div>
      )}
    </div>
  );
};

export default Article;
