import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArticlesByCategory } from '../firebase/firebaseConfig';
import Article from './Article';
import '../styles/Category.css'; // Import the new CSS file for the category page

const Category = () => {
  const { categoryName } = useParams();

  const [articles, setArticles] = useState([]);

  const fetchArticlesFromServer = async () => {
    try {
      const fetchedArticles = await fetchArticlesByCategory('articles', categoryName); // Pass your collection key here
      setArticles(fetchedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    fetchArticlesFromServer();
  }, [categoryName]);

  return (
    <div className='category-container'>
      <h1>{categoryName}</h1>
      {articles.map(article => (
        <Article
          key={article.id}
          id={article.id}
          title={article.title}
          content={article.content}
          category={article.category}
          imagePath={article.imagePath}
        />
      ))}
    </div>
  );
};

export default Category;
