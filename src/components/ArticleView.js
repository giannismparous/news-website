import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, EmailShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, LinkedinIcon, EmailIcon } from 'react-share';

import { fetchArticleById, fetchLatestArticles, fetchArticlesByCategory } from '../firebase/firebaseConfig';

import SmallArticle from './SmallArticle';
import Article from './Article';

import '../styles/ArticleView.css';



const ArticleView = () => {

  const { articleId } = useParams();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [article,        setArticle]        = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);

  const formatCategoryName = (name) => {
    switch (name) {
      case 'Kedpress_ΕΣΗΕΑ':
        return 'Kedpress/ ΕΣΗΕΑ';
      case 'Υγεία_Συντάξεις':
        return 'Υγεία/ Συντάξεις';
      case 'Plus_Life':
        return 'Plus/ Life';
      case 'Εκτός_Συνόρων':
        return 'Εκτός Συνόρων';
      case 'Αγορά_Καταναλωτές':
        return 'Αγορά/ Καταναλωτές';
      default:
        return name;
    }
  };

  useEffect(() => {
    const id = parseInt(articleId, 10);
    if (isNaN(id)) return;

    (async () => {
      const a = await fetchArticleById('articles', id);
      setArticle(a);
      if (!a) return;

      const rel = await fetchArticlesByCategory('articles', a.category, 4);
      setRelatedArticles(rel.filter(x => x.id !== id).slice(0, 3));

      const latest9 = await fetchLatestArticles('articles', 9);
      setLatestArticles(latest9.filter(x => x.id !== id));
    })().catch(console.error);
  }, [articleId]);

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

  if (!article) {
    return <div>Loading...</div>;
  }

  const shareUrl = window.location.href;
  const title = article.title;

  const filteredLatestArticles = latestArticles.filter(latestArticle => latestArticle.id !== parseInt(articleId));

  return (
    <>
      <Helmet>
        <title>{article.title}</title>
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.content} />
        <meta property="og:image" content={article.imagePath} />
        <meta property="og:url" content={`https://syntaktes.gr/articles/${articleId}`} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={article.title} />
        <meta property="twitter:description" content={article.content} />
        <meta property="twitter:image" content={article.imagePath} />
      </Helmet>
      <div className='article-view-container'>
        {!isMobile && <div className='left-column'>
          <div className='article-view-details'>
            <p>{formatCategoryName(article.category)} | {article.date ? article.date : "24/6/2024 | 13:00"}</p>
          </div>
          <div className='article-view-relevant-articles'>
            <h3>Σχετικά άρθρα</h3>
            {relatedArticles.map((relatedArticle) => (
              <SmallArticle
                key={relatedArticle.id}
                id={relatedArticle.id}
                title={relatedArticle.title}
                category={relatedArticle.category}
                imagePath={relatedArticle.imagePath}
                showHelmet = {false}
              />
            ))}
          </div>
        </div>}
        <div className='column-vertical'>
          <div className='article-content'>
          {article.videoPath ? (
              <div className='video-container'>
              <iframe
                  src={`https://www.youtube.com/embed/${article.videoPath.split('v=')[1].split('&')[0]}`}
                  title={article.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
              />
          </div>
          ) : (
              article.imagePath && <img src={article.imagePath} alt={article.title} />
          )}
            {article.caption && <p className='article-caption'>{article.caption}</p>}
            <h1>{article.title}</h1>
            <p className='author-text'>{article.author ? `${article.authorPrefix ? article.authorPrefix : 'Του'} ${article.author}` : 'News Room'}</p>
            <div className='share-buttons'>
              <strong>Κοινοποιήστε αυτό το άρθρο:</strong>
              <FacebookShareButton url={`www.syntaktes.gr/articles/${articleId}`} quote={title} hashtag={`#${article.category}`}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={`www.syntaktes.gr/articles/${articleId}`} title={title}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <LinkedinShareButton url={`www.syntaktes.gr/articles/${articleId}`} title={title} summary={article.content} source={shareUrl}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
              <EmailShareButton url={`www.syntaktes.gr/articles/${articleId}`} subject={title} body={article.content}>
                <EmailIcon size={32} round />
              </EmailShareButton>
            </div>
            <div className='article-info' dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
          <div className="container">
            <h1>Δείτε επίσης</h1>
            <div className="koinonia-articles">
              <div className="koinonia-article-large">
                {filteredLatestArticles.slice(0, 3).map(article => (
                  <Article
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    content={article.content}
                    category={article.category}
                    author={article.author}
                    date={article.date}
                    imagePath={article.imagePath}
                    maxWordsPreview={25}
                    showHelmet = {false}
                  />
                ))}
              </div>
              <div className="koinonia-articles-small">
                {filteredLatestArticles.slice(3, 6).map(article => (
                  <SmallArticle
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    category={article.category}
                    author={article.author}
                    date={article.date}
                    imagePath={article.imagePath}
                    showHelmet = {false}
                  />
                ))}
              </div>
              <div className="koinonia-articles-small">
                {filteredLatestArticles.slice(6, 9).map(article => (
                  <SmallArticle
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    category={article.category}
                    author={article.author}
                    date={article.date}
                    imagePath={article.imagePath}
                    showHelmet = {false}
                  />
                ))}
              </div>
            </div>
            <div className="see-all">
              <a href="/">Δείτε περισσότερα →</a>
            </div> 
          </div> 
        </div>
      </div>
    </>
  );
};

export default ArticleView;
