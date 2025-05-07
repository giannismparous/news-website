import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { searchArticlesByTitleSingleWord } from '../firebase/firebaseConfig';

import Article from './Article';

import '../styles/Search.css';

const Search = () => {

  const { query } = useParams(); 
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    searchArticlesByTitleSingleWord('articles', query, 100)
      .then(setArticles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) return <p>Loading…</p>;

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
            showHelmet={false}
          />
        ))
      ) : (
        <p>Δεν υπάρχουν αποτελέσματα.</p>
      )}
    </div>
  );
};

export default Search;
