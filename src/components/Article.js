import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Article.css'; // Import your CSS file

const Article = ({ id, title, content, category, imagePath, authorImagePath,author, date, showContent = true, maxWordsPreview=30 }) => {
  // Function to format category names
  const formatCategoryName = (name) => {
    switch (name) {
      case 'Kedpress_ΕΣΗΕΑ':
        return 'Kedpress/ ΕΣΗΕΑ';
      case 'Υγεία_Συντάξεις':
        return 'Υγεία/ Συντάξεις';
      case 'Plus_Life':
        return 'Plus/ Life';
      case 'Εκτός Συνόρων':
        return 'Εκτός Συνόρων';
      case 'Αγορά_Καταναλωτές':
        return 'Αγορά/ Καταναλωτές';
      default:
        return name;
    }
  };

  // Strip HTML tags from content
  const strippedContent = content.replace(/<[^>]*>?/gm, '');
  const words = strippedContent.split(' ');
  const displayContent = words.slice(0, maxWordsPreview).join(' ');
  const hasMore = words.length > maxWordsPreview;

  // Default date value if date is undefined
  const displayDate = date ? date : "24/6/2024 | 13:00";

  return (
    <div className="article">
      <Link to={`/articles/${id}`} className="article-link">
        {imagePath && <img src={imagePath} alt={title} className="article-image" />}
      </Link>
      <div className='article-info'>
        <Link to={`/articles/${id}`} className="article-link">
          <h2>{title}</h2>
          <p><em>{formatCategoryName(category)} | {displayDate}</em></p>
          {showContent && (
            <div>
              <p 
                className="content-text" 
                dangerouslySetInnerHTML={{ __html: displayContent + (hasMore ? ' <span class="read-more">[...]</span>' : '') }}
              ></p>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Article;
