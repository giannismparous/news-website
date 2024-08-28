import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchArticles, fetchArticlesByCategory } from '../firebase/firebaseConfig';
import Article from './Article';
import '../styles/Category.css'; // Import the new CSS file for the category page
import SmallArticle from './SmallArticle';
import { useMediaQuery } from 'react-responsive';
import { ClockLoader } from 'react-spinners';
import { Helmet } from 'react-helmet-async';

const Category = () => {

  const { categoryName } = useParams();

  const [articles, setArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  const isMobile = useMediaQuery({ maxWidth: 550 });

  const fetchArticlesFromServer = async () => {
    try {
      var fetchedArticles;
      const fetchedLatestArticles = await fetchArticles('articles');
      if (categoryName!=="all"){
        fetchedArticles = await fetchArticlesByCategory('articles', categoryName); // Pass your collection key here
      }
      else {
        fetchedArticles = fetchedLatestArticles
      }
      setArticles([...fetchedArticles].reverse());
      setLatestArticles([...fetchedLatestArticles].reverse());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchArticlesFromServer();
  }, [categoryName]);

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
      case 'all':
      return 'Όλα τα δημοσιεύματα';
      default:
        return name;
    }
  };

  const className = formatCategoryName(categoryName) === "Απόψεις" ? 'category-apopsi' : '';

  if (loading) {
    return (
        <div className="spinner-container">
            <ClockLoader color="#e29403d3" loading={loading} size={150} />
        </div>
    );
}

  return (
    <>
      <Helmet>
          <title>{categoryName}</title>  
          <meta name="description" content={`Τα άρθρα που ανοίκουν στην κατηγορία ${categoryName} στην ιστοσελίδα "Syntaktes"`}/>
          <link rel="canonical" href={`/category/${categoryName}`}/>
      </Helmet>
      <div className='category-container'>
        <h1>{formatCategoryName(categoryName)}</h1>
        <div className={className}>
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
              authorImagePath={article.authorImagePath}
              showContent={!isMobile}
              apopsi={true}
            />
        ))}
        </div>
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
                        showContent={!isMobile}
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
                        showContent={!isMobile}
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
                        showContent={!isMobile}
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
