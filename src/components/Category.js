import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { ClockLoader } from 'react-spinners';
import { Helmet } from 'react-helmet-async';

import { fetchLatestArticles, fetchCategoryPage, fetchCategoryPageAfter } from '../firebase/firebaseConfig';

import Article from './Article';
import SmallArticle from './SmallArticle';

import '../styles/Category.css';

const Category = () => {

  const { categoryName } = useParams();
  const isMobile = useMediaQuery({ maxWidth: 550 });

  const [articles, setArticles]       = useState([]);
  const [latestArticles, setLatest]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const lastDocRef = useRef(null);

   useEffect(() => {
    setLoading(true);
    lastDocRef.current = null;
    Promise.all([
      fetchCategoryPage('articles', categoryName, 5),
      fetchLatestArticles('articles', 9)
    ]).then(([ { docs, last }, latest ]) => {
      setArticles(docs);
      setLatest(latest);
      lastDocRef.current = last;
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryName]);

  const handleScroll = useCallback(() => {
    const threshold = document.documentElement.scrollHeight/2;
    if (
      window.innerHeight + window.scrollY >= threshold &&
      !loadingMore &&
      lastDocRef.current
    ) {
      setLoadingMore(true);
      fetchCategoryPageAfter(
        'articles',
        categoryName,
        lastDocRef.current,
        15
      )
        .then(({ docs, last }) => {
          
          setArticles(prev => {
            const existingIds = new Set(prev.map(a => a.id));
            const newOnes = docs.filter(d => !existingIds.has(d.id));
            return prev.concat(newOnes);
          });
          lastDocRef.current = last;
        })
        .catch(console.error)
        .finally(() => setLoadingMore(false));
    }
  }, [categoryName, loadingMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const handleScroll = () => {
      
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
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
          <meta name="description" content={`Τα άρθρα που ανήκουν στην κατηγορία ${categoryName} στην ιστοσελίδα "Syntaktes"`}/>
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
              showHelmet = {false}
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
                        showHelmet = {false}
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
                        showHelmet = {false}
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
                        showHelmet = {false}
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
