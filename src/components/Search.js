// Search.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArticlesByTitle } from '../firebase/firebaseConfig';
import Article from './Article';
import '../styles/Search.css'; // Create and import a CSS file for search page styling

const Search = () => {
  const { query } = useParams(); // Use query from URL parameters
  const [articles, setArticles] = useState([]);

  const fetchArticlesFromServer = async () => {
    try {
        
      const fetchedArticles = await fetchArticlesByTitle('articles', query); // Pass your collection key here
      setArticles(fetchedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    console.log(query)
    fetchArticlesFromServer();
  }, [query]);

  return (
    <div className='search-container'>
      <h1>Αποτελέσματα αναζήτησης για "{query}"</h1>
      {articles.length > 0 ? (
        articles.map(article => (
          <Article
            key={article.id}
            id={article.id}
            title={article.title}
            content={article.content}
            category={article.category}
            imagePath={article.imagePath}
            showHelmet = {false}
          />
        ))
      ) : (
        <p>No articles found matching your search query.</p>
      )}
    </div>
  );
};

export default Search;
