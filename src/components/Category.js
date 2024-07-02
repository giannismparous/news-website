import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchArticles, fetchArticlesByCategory } from '../firebase/firebaseConfig';
import Article from './Article';
import '../styles/Category.css'; // Import the new CSS file for the category page
import SmallArticle from './SmallArticle';

const Category = () => {
  const { categoryName } = useParams();

  const [articles, setArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);

  const fetchArticlesFromServer = async () => {
    try {
      const fetchedArticles = await fetchArticlesByCategory('articles', categoryName); // Pass your collection key here
      const fetchedLatestArticles = await fetchArticles('articles');
      setArticles([...fetchedArticles].reverse());
      setLatestArticles([...fetchedLatestArticles].reverse());
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    fetchArticlesFromServer();
  }, [categoryName]);

  return (
    <>
      <div className='category-container'>
        <h1>{categoryName}</h1>
        {articles.map(article => (
            <Article
              key={article.id}
              id={article.id}
              title={article.title}
              content={article.content}
              category={article.category}
              author={article.author}
              date={article.date}
              imagePath={article.imagePath}
            />
        ))}
      </div>
      <div className="container">
        <h1>Δείτε επίσης</h1>
        <div className="koinonia-articles">
            <div className="koinonia-article-large">
                {latestArticles.slice(0, 3).map(article => (
                    <Article
                        key={article.id}
                        id={article.id}
                        title={article.title}
                        content={article.content}
                        category={article.category}
                        author={article.author}
                        date={article.date}
                        imagePath={article.imagePath}
                    />
                ))}
            </div>
            <div className="koinonia-articles-small">
                {latestArticles.slice(3, 6).map(article => (
                    <SmallArticle
                        key={article.id}
                        id={article.id}
                        title={article.title}
                        category={article.category}
                        author={article.author}
                        date={article.date}
                        imagePath={article.imagePath}
                    />
                ))}
            </div>
            <div className="koinonia-articles-small">
                {latestArticles.slice(6, 9).map(article => (
                    <SmallArticle
                        key={article.id}
                        id={article.id}
                        title={article.title}
                        category={article.category}
                        author={article.author}
                        date={article.date}
                        imagePath={article.imagePath}
                    />
                ))}
            </div>
        </div>
        <div className="see-all">
            <a href="/">Δείτε περισσότερα →</a>
        </div>  
    </div>
    </>
  );
};

export default Category;
