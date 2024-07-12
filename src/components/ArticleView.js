import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArticleById, fetchArticles, fetchArticlesByCategory } from '../firebase/firebaseConfig'; // Import your fetch functions
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, EmailShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, LinkedinIcon, EmailIcon } from 'react-share';
import '../styles/ArticleView.css'; // Import the CSS file for ArticleView
import SmallArticle from './SmallArticle'; // Import SmallArticle component
import Article from './Article';
import { useMediaQuery } from 'react-responsive';

const ArticleView = () => {
  const { articleId } = useParams(); // Assuming your route provides articleId as a param

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const fetchedArticle = await fetchArticleById('articles', parseInt(articleId)); // Adjust as per your collection key
        setArticle(fetchedArticle);

        if (fetchedArticle) {
          const related = await fetchArticlesByCategory('articles', fetchedArticle.category);
          setRelatedArticles(related.filter(item => item.id !== fetchedArticle.id).slice(0, 3));

          const fetchedLatestArticles = await fetchArticles('articles');
          setLatestArticles([...fetchedLatestArticles].reverse());
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (!article) {
    return <div>Loading...</div>;
  }

  const shareUrl = window.location.href;
  const title = article.title;

  return (
    <>
      <div className='article-view-container'>
        {!isMobile && <div className='left-column'>
          <div className='article-view-details'>
            <p>{article.category} | {article.date ? article.date : "24/6/2024 | 13:00"}</p>
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
              />
            ))}
          </div>
        </div>}
        <div className='column-vertical'>
          <div className='article-content'>
            {article.imagePath && <img src={article.imagePath} alt={article.title} />}
            <h1>{article.title}</h1>
            <div className='share-buttons'>
              <strong>Κοινοποιήστε αυτό το άρθρο:</strong>
              <FacebookShareButton url={shareUrl} quote={title} hashtag={`#${article.category}`}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={title}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl} title={title} summary={article.content} source={shareUrl}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
              <EmailShareButton url={shareUrl} subject={title} body={article.content}>
                <EmailIcon size={32} round />
              </EmailShareButton>
            </div>
            <div className='article-info' dangerouslySetInnerHTML={{ __html: article.content }} />
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
                    maxWordsPreview={25}
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
        </div>
      </div>
    </>
  );
};

export default ArticleView;
