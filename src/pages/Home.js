import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { ClockLoader } from 'react-spinners';
import { Helmet } from 'react-helmet-async';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import Article from '../components/Article';
import SmallArticle from '../components/SmallArticle';

import { fetchArticlesByCategory, fetchTrendingArticles, fetchLatestArticles} from '../firebase/firebaseConfig';

import '../styles/Home.css';

const Home = () => {

    useEffect(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, []);

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

    const [latestArticles, setLatestArticles] = useState([]);
    const [trendingArticles, setTrendingArticles] = useState([]);
    const [politikiArticles, setPolitikiArticles] = useState([]);
    const [apopseisArticles, setApopseisArticles] = useState([]);
    const [paraskiniaArticles, setParaskiniaArticles] = useState([]);
    const [kedpressEsheaArticles, setKedpressEsheaArticles] = useState([]);
    const [oikonomiaArticles, setOikonomiaArticles] = useState([]);
    const [ektosSynorwnArticles, setEktosSynorwnArticles] = useState([]);
    const [agoraKanalwtesArticles, setAgoraKatanalwtesArticles] = useState([]);
    const [plusLifeArticles, setPlusLifeArticles] = useState([]);
    const [sporArticles, setSporArticles] = useState([]);
    const [artArticles, setArtArticles] = useState([]);
    const [petArticles, setPetArticles] = useState([]);
    const [ygeiaSyntaxeisArticles, setYgeiaSyntaxeisArticles] = useState([]);
    const [ergasiaArticles, setErgasiaArticles] = useState([]);
    const [dikastikaArticles, setDikastikaArticles] = useState([]);

    const [loading, setLoading] = useState(true);

    // TRENDING (5 items)
    const fetchTrendingArticlesFromServer = async () => {
        try {
            const tr = await fetchTrendingArticles('articles', 5);
            setTrendingArticles(tr);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching articles:', error);
            setLoading(false);
        }
    };

    // LATEST (4 items)
    const fetchLatestArticlesFromServer = async () => {
        try {
            const latest = await fetchLatestArticles('articles', 4);
            setLatestArticles(latest);
        } catch (err) {
            console.error("Failed to load latest:", err);
        }
    };

    // ΠΟΛΙΤΙΚΗ (3 items)
    const fetchPolitikiArticles = async () => {
    try {
      const fetched = await fetchArticlesByCategory('articles', 'Πολιτική', 3);
      fetched.reverse();
      setPolitikiArticles(fetched);
    } catch (error) {
      console.error('Error fetching Πολιτική articles:', error);
    }
  };
  
  // ΑΠΟΨΕΙΣ (1 items)
  const fetchApopseisArticles = async () => {
    try {
      const fetched = await fetchArticlesByCategory('articles', 'Απόψεις', 1);
      setApopseisArticles(fetched);
    } catch (error) {
      console.error('Error fetching Απόψεις articles:', error);
    }
  };
  
  // ΠΑΡΑΣΚΗΝΙΑ (5 items)
  const fetchParaskiniaArticles = async () => {
    try {
      const fetched = await fetchArticlesByCategory('articles', 'Παρασκήνια', 5);
      fetched.reverse();
      setParaskiniaArticles(fetched);
    } catch (error) {
      console.error('Error fetching Παρασκήνια articles:', error);
    }
  };
  
  // KEDPRESS/ ΕΣΗΕΑ (4 items)
  const fetchKedpressEsheaArticles = async () => {
    try {
      const fetched = await fetchArticlesByCategory('articles', 'Kedpress_ΕΣΗΕΑ', 4);
      setKedpressEsheaArticles(fetched);
    } catch (error) {
      console.error('Error fetching Kedpress ΕΣΗΕΑ articles:', error);
    }
  };
  
  // ΟΙΚΟΝΟΜΙΑ (5 items)
  const fetchOikonomiaArticles = async () => {
    try {
      const fetched = await fetchArticlesByCategory('articles', 'Οικονομία', 5);
      fetched.reverse();
      setOikonomiaArticles(fetched);
    } catch (error) {
      console.error('Error fetching Οικονομία articles:', error);
    }
  };
  
  // ΕΚΤΟΣ ΣΥΝΟΡΩΝ (9 items)
  const fetchEktosSynorwnArticles = async () => {
    try {
      const fetched = await fetchArticlesByCategory('articles', 'Εκτός_Συνόρων', 9);
      setEktosSynorwnArticles(fetched);
    } catch (error) {
      console.error('Error fetching Εκτός Συνόρων articles:', error);
    }
  };
  
  // ΑΓΟΡΑ/ ΚΑΤΑΝΑΛΩΤΕΣ (5 items)
  const fetchAgoraKatanalwtesArticles = async () => {
    try {
      const fetched = await fetchArticlesByCategory('articles', 'Αγορά_Καταναλωτές', 5);
      fetched.reverse();
      setAgoraKatanalwtesArticles(fetched);
    } catch (error) {
      console.error('Error fetching Αγορά/ Καταναλωτές articles:', error);
    }
  };
  
  // PLUS/ LIFE (4 items)
  const fetchPlusLifeArticles = async () => {
    try {
      const fetched = await fetchArticlesByCategory('articles', 'Plus_Life', 4);
      setPlusLifeArticles(fetched);
    } catch (error) {
      console.error('Error fetching Plus/ Life articles:', error);
    }
  };
  
  // ΣΠΟΡ (9 items)
  const fetchSporArticles = async () => {
    try {
      const fetched = await fetchArticlesByCategory('articles', 'Σπορ', 9);
      setSporArticles(fetched);
    } catch (error) {
      console.error('Error fetching Σπορ articles:', error);
    }
  };
  
  // ART (4 items)
  const fetchArtArticles = async () => {
    try {
      const fetched = await fetchArticlesByCategory('articles', 'Art', 4);
      setArtArticles(fetched);
    } catch (error) {
      console.error('Error fetching Art articles:', error);
    }
  };
  
  // PET (4 items)
  const fetchPetArticles = async () => {
    try {
      const fetched = await fetchArticlesByCategory('articles', 'Pet', 4);
      setPetArticles(fetched.reverse());
    } catch (error) {
      console.error('Error fetching Pet articles:', error);
    }
  };
  
  // ΥΓΕΙΑ/ ΣΥΝΤΑΞΕΙΣ (5 items)
  const fetchYgeiaSyntaxeisArticles = async () => {
    try {
      const fetched = await fetchArticlesByCategory('articles', 'Υγεία_Συντάξεις', 5);
      setYgeiaSyntaxeisArticles(fetched);
    } catch (error) {
      console.error('Error fetching Υγεία/ Συντάξεις articles:', error);
    }
  };
  
  // ΕΡΓΑΣΙΑ (5 items)
  const fetchErgasiaArticles = async () => {
    try {
      const fetched = await fetchArticlesByCategory('articles', 'Εργασία', 5);
      fetched.reverse();
      setErgasiaArticles(fetched);
    } catch (error) {
      console.error('Error fetching Εργασία articles:', error);
    }
  };
  
  // ΔΙΚΑΣΤΙΚΑ (4 items)
  const fetchDikastikaArticles = async () => {
    try {
      const fetched = await fetchArticlesByCategory('articles', 'Δικαστικά', 4);
      setDikastikaArticles(fetched);
    } catch (error) {
      console.error('Error fetching Δικαστικά articles:', error);
    }
  };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchTrendingArticlesFromServer();
        fetchLatestArticlesFromServer();
        fetchPolitikiArticles();
        fetchOikonomiaArticles();
        fetchApopseisArticles();
        fetchParaskiniaArticles();
        fetchKedpressEsheaArticles();
        fetchEktosSynorwnArticles();
        fetchAgoraKatanalwtesArticles();
        fetchPlusLifeArticles();
        fetchSporArticles();
        fetchArtArticles();
        fetchPetArticles();
        fetchYgeiaSyntaxeisArticles();
        fetchErgasiaArticles();
        fetchDikastikaArticles();
    }, []);

    const isMobile = useMediaQuery({ maxWidth: 550 });

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

    if (loading) {
        return (
            <div className="spinner-container">
                <ClockLoader color="#e29403d3" loading={loading} size={150} />
            </div>
        );
    }

    return (
        <div className='home-container'>
            <Helmet>
                <title>Syntaktes</title>  
                <meta name="description" content="Στην ιστοσελίδα syntaktes.gr δημοσιογράφοι και ειδικοί συνεργάτες αποκαλύπτουν, καταγράφουν και αναλύουν τα γεγονότα, χωρίς δεσμεύσεις. Η άλλη όψη του νομίσματος είναι εδώ."/>
                <link rel="canonical" href="/"/>
            </Helmet>
            <div className="trending-container">
                <Carousel showThumbs={false} autoPlay infiniteLoop>
                    {trendingArticles.map(article => (
                        <div key={article.id} className="carousel-article" style={{ backgroundImage: `url(${article.imagePath})`, backgroundPosition: `100% ${article.imageVerticalPositionInTrending || 50}%`, backgroundSize: 'cover' }}>
                            <Link to={`/articles/${article.id}`} className="article-link">
                            <div className="carousel-caption">
                                {/* <p>{article.category}</p> */}
                                <p>{formatCategoryName(article.category).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}</p>
                                <h3>{article.title}</h3>
                            </div>
                            </Link>
                        </div>
                    ))}
                </Carousel>
            </div>
            <div className="container">
                <h1>NEWS ROOM</h1>
                <div className="latest-articles">
                    <div className="latest-article-large">
                        {latestArticles[0] && (
                            <Article
                                key={latestArticles[0].id}
                                id={latestArticles[0].id}
                                title={latestArticles[0].title}
                                content={latestArticles[0].content}
                                category={latestArticles[0].category}
                                author={latestArticles[0].author}
                                date={latestArticles[0].date}
                                imagePath={latestArticles[0].imagePath}
                                caption={latestArticles[0].caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        )}
                    </div>
                    <div className="latest-articles-small">
                        {latestArticles.slice(1, 4).map(article => (
                            <div key={article.id} className="small-article-container-outer">
                            <SmallArticle
                                id={article.id}
                                title={article.title}
                                category={article.category}
                                author={article.author}
                                date={article.date}
                                imagePath={article.imagePath}
                                caption={article.caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                            </div>
                        ))}
                        {/* <div className="see-all">
                            <a href="/">Δείτε περισσότερα →</a>
                        </div> */}
                    </div>
                </div>
                <div className="see-all">
                    <a href="/category/all">Δείτε όλα τα δημοσιεύματα →</a>
                </div>  
            </div>
            <div className="container">
                <h1>ΠΟΛΙΤΙΚΗ</h1>
                <div className="kosmos-articles">
                    <div className="kosmos-articles-small">
                        {politikiArticles.slice(0, 2).map(article => (
                            <SmallArticle
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                category={article.category}
                                author={article.author}
                                date={article.date}
                                imagePath={article.imagePath}
                                caption={article.caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        ))}
                    </div>
                    <div className="kosmos-article-large">
                        {politikiArticles[2] && (
                            <Article
                                key={politikiArticles[2].id}
                                id={politikiArticles[2].id}
                                title={politikiArticles[2].title}
                                content={politikiArticles[2].content}
                                category={politikiArticles[2].category}
                                author={politikiArticles[2].author}
                                date={politikiArticles[2].date}
                                imagePath={politikiArticles[2].imagePath}
                                caption={politikiArticles[2].caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        )}
                        <div className="see-all">
                            <a href="/category/Πολιτική">Δείτε περισσότερα →</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <h1>ΑΠΟΨΕΙΣ</h1>
                <div className="apopseis-articles">
                    <div className="apopseis-article-large">
                        {apopseisArticles[0] && (
                            <Article
                                key={apopseisArticles[0].id}
                                id={apopseisArticles[0].id}
                                title={apopseisArticles[0].title}
                                content={apopseisArticles[0].content}
                                category={apopseisArticles[0].category}
                                author={apopseisArticles[0].author}
                                authorPrefix={apopseisArticles[0].authorPrefix}
                                authorImagePath={apopseisArticles[0].authorImagePath}
                                date={apopseisArticles[0].date}
                                imagePath={apopseisArticles[0].imagePath}
                                showContent={!isMobile}
                                caption={apopseisArticles[0].caption}
                                maxWordsPreview={15}
                                apopsi={true}
                                showHelmet = {false}
                            />
                        )}
                        {/*
                        {apopseisArticles[1] && (
                            <Article
                                key={apopseisArticles[1].id}
                                id={apopseisArticles[1].id}
                                title={apopseisArticles[1].title}
                                content={apopseisArticles[1].content}
                                category={apopseisArticles[1].category}
                                author={apopseisArticles[1].author}
                                authorPrefix={apopseisArticles[1].authorPrefix}
                                authorImagePath={apopseisArticles[1].authorImagePath}
                                date={apopseisArticles[1].date}
                                imagePath={apopseisArticles[1].imagePath}
                                caption={apopseisArticles[1].caption}
                                showContent={!isMobile}
                                maxWordsPreview={15}
                                apopsi={true}
                                showHelmet = {false}
                            />
                        )}
                        {apopseisArticles[2] && (
                            <Article
                                key={apopseisArticles[2].id}
                                id={apopseisArticles[2].id}
                                title={apopseisArticles[2].title}
                                content={apopseisArticles[2].content}
                                category={apopseisArticles[2].category}
                                author={apopseisArticles[2].author}
                                authorPrefix={apopseisArticles[2].authorPrefix}
                                authorImagePath={apopseisArticles[2].authorImagePath}
                                date={apopseisArticles[2].date}
                                imagePath={apopseisArticles[2].imagePath}
                                caption={apopseisArticles[2].caption}
                                showContent={!isMobile}
                                maxWordsPreview={15}
                                apopsi={true}
                                showHelmet = {false}
                            />
                        )}
                        */}
                    </div>
                </div>
                <div className="see-all">
                    <a href="/category/Απόψεις">Δείτε περισσότερα →</a>
                </div>  
            </div>
            <div className="container">
                <h1>ΠΑΡΑΣΚΗΝΙΑ</h1>
                <div className="oikonomia-articles">
                    <div className="oikonomia-articles-small-columns">
                        {paraskiniaArticles.slice(0, 4).map((article, index) => (
                            <div key={article.id} className="small-article-column">
                                <SmallArticle
                                    id={article.id}
                                    title={article.title}
                                    category={article.category}
                                    author={article.author}
                                    date={article.date}
                                    imagePath={article.imagePath}
                                    caption={article.caption}
                                    showContent={!isMobile}
                                    showHelmet = {false}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="oikonomia-article-large">
                        {paraskiniaArticles[4] && (
                            <Article
                                key={paraskiniaArticles[4].id}
                                id={paraskiniaArticles[4].id}
                                title={paraskiniaArticles[4].title}
                                content={paraskiniaArticles[4].content}
                                category={paraskiniaArticles[4].category}
                                author={paraskiniaArticles[4].author}
                                date={paraskiniaArticles[4].date}
                                imagePath={paraskiniaArticles[4].imagePath}
                                caption={paraskiniaArticles[4].caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        )}
                    </div>
                </div>
                <div className="see-all">
                    <a href="/category/Παρασκήνια">Δείτε περισσότερα →</a>
                </div>  
            </div>
            <div className="container">
                <h1>KEDPRESS/ ΕΣΗΕΑ</h1>
                <div className="latest-articles">
                    <div className="latest-article-large">
                        {kedpressEsheaArticles[0] && (
                            <Article
                                key={kedpressEsheaArticles[0].id}
                                id={kedpressEsheaArticles[0].id}
                                title={kedpressEsheaArticles[0].title}
                                content={kedpressEsheaArticles[0].content}
                                category={kedpressEsheaArticles[0].category}
                                author={kedpressEsheaArticles[0].author}
                                date={kedpressEsheaArticles[0].date}
                                imagePath={kedpressEsheaArticles[0].imagePath}
                                caption={kedpressEsheaArticles[0].caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        )}
                    </div>
                    <div className="latest-articles-small">
                        {kedpressEsheaArticles.slice(1, 4).map(article => (
                            <div key={article.id} className="small-article-container-outer">
                            <SmallArticle
                                id={article.id}
                                title={article.title}
                                category={article.category}
                                author={article.author}
                                date={article.date}
                                imagePath={article.imagePath}
                                caption={article.caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                            </div>
                        ))}
                        <div className="see-all">
                            <a href="/category/Kedpress_ΕΣΗΕΑ">Δείτε περισσότερα →</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <h1>ΟΙΚΟΝΟΜΙΑ</h1>
                <div className="oikonomia-articles">
                    <div className="oikonomia-articles-small-columns">
                        {oikonomiaArticles.slice(0, 4).map((article, index) => (
                            <div key={article.id} className="small-article-column">
                                <SmallArticle
                                    id={article.id}
                                    title={article.title}
                                    category={article.category}
                                    author={article.author}
                                    date={article.date}
                                    imagePath={article.imagePath}
                                    caption={article.caption}
                                    showContent={!isMobile}
                                    showHelmet = {false}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="oikonomia-article-large">
                        {oikonomiaArticles[4] && (
                            <Article
                                key={oikonomiaArticles[4].id}
                                id={oikonomiaArticles[4].id}
                                title={oikonomiaArticles[4].title}
                                content={oikonomiaArticles[4].content}
                                category={oikonomiaArticles[4].category}
                                author={oikonomiaArticles[4].author}
                                date={oikonomiaArticles[4].date}
                                imagePath={oikonomiaArticles[4].imagePath}
                                caption={oikonomiaArticles[4].caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        )}
                    </div>
                </div>
                <div className="see-all">
                    <a href="/category/Οικονομία">Δείτε περισσότερα →</a>
                </div>  
            </div>
            <div className="container">
                <h1>ΕΚΤΟΣ ΣΥΝΟΡΩΝ</h1>
                <div className="koinonia-articles">
                    <div className="koinonia-article-large">
                        {ektosSynorwnArticles.slice(0, 3).map(article => (
                            <Article
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                content={article.content}
                                category={article.category}
                                author={article.author}
                                date={article.date}
                                imagePath={article.imagePath}
                                caption={article.caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        ))}
                    </div>
                    <div className="koinonia-articles-small">
                        {ektosSynorwnArticles.slice(3, 6).map(article => (
                            <SmallArticle
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                category={article.category}
                                author={article.author}
                                date={article.date}
                                imagePath={article.imagePath}
                                caption={article.caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        ))}
                    </div>
                    <div className="koinonia-articles-small">
                        {ektosSynorwnArticles.slice(6, 9).map(article => (
                            <SmallArticle
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                category={article.category}
                                author={article.author}
                                date={article.date}
                                imagePath={article.imagePath}
                                caption={article.caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        ))}
                    </div>
                </div>
                <div className="see-all">
                    <a href="/category/Εκτός_Συνόρων">Δείτε περισσότερα →</a>
                </div>  
            </div>
            <div className="container">
                <h1>ΑΓΟΡΑ/ ΚΑΤΑΝΑΛΩΤΕΣ</h1>
                <div className="oikonomia-articles">
                    <div className="oikonomia-articles-small-columns">
                        {agoraKanalwtesArticles.slice(0, 4).map((article, index) => (
                            <div key={article.id} className="small-article-column">
                                <SmallArticle
                                    id={article.id}
                                    title={article.title}
                                    category={article.category}
                                    author={article.author}
                                    date={article.date}
                                    imagePath={article.imagePath}
                                    caption={article.caption}
                                    showContent={!isMobile}
                                    showHelmet = {false}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="oikonomia-article-large">
                        {agoraKanalwtesArticles[4] && (
                            <Article
                                key={agoraKanalwtesArticles[4].id}
                                id={agoraKanalwtesArticles[4].id}
                                title={agoraKanalwtesArticles[4].title}
                                content={agoraKanalwtesArticles[4].content}
                                category={agoraKanalwtesArticles[4].category}
                                author={agoraKanalwtesArticles[4].author}
                                date={agoraKanalwtesArticles[4].date}
                                imagePath={agoraKanalwtesArticles[4].imagePath}
                                caption={agoraKanalwtesArticles[4].caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        )}
                    </div>
                </div>
                <div className="see-all">
                    <a href="/category/Αγορά_Καταναλωτές">Δείτε περισσότερα →</a>
                </div>  
            </div>
            <div className="container">
                <h1>PLUS/ LIFE</h1>
                <div className="latest-articles">
                    <div className="latest-article-large">
                        {plusLifeArticles[0] && (
                            <Article
                                key={plusLifeArticles[0].id}
                                id={plusLifeArticles[0].id}
                                title={plusLifeArticles[0].title}
                                content={plusLifeArticles[0].content}
                                category={plusLifeArticles[0].category}
                                author={plusLifeArticles[0].author}
                                date={plusLifeArticles[0].date}
                                imagePath={plusLifeArticles[0].imagePath}
                                caption={plusLifeArticles[0].caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        )}
                    </div>
                    <div className="latest-articles-small">
                        {plusLifeArticles.slice(1, 4).map(article => (
                            <div key={article.id} className="small-article-container-outer">
                            <SmallArticle
                                id={article.id}
                                title={article.title}
                                category={article.category}
                                author={article.author}
                                date={article.date}
                                imagePath={article.imagePath}
                                caption={article.caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                            </div>
                        ))}
                        <div className="see-all">
                            <a href="/category/Plus_Life">Δείτε περισσότερα →</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <h1>ΣΠΟΡ</h1>
                <div className="koinonia-articles">
                    <div className="koinonia-article-large">
                        {sporArticles.slice(0, 3).map(article => (
                            <Article
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                content={article.content}
                                category={article.category}
                                author={article.author}
                                date={article.date}
                                imagePath={article.imagePath}
                                caption={article.caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        ))}
                    </div>
                    <div className="koinonia-articles-small">
                        {sporArticles.slice(3, 6).map(article => (
                            <div key={article.id} className="small-article-container-outer">
                                <SmallArticle
                                    id={article.id}
                                    title={article.title}
                                    category={article.category}
                                    author={article.author}
                                    date={article.date}
                                    imagePath={article.imagePath}
                                    caption={article.caption}
                                    showContent={!isMobile}
                                    showHelmet = {false}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="koinonia-articles-small">
                        {sporArticles.slice(6, 9).map(article => (
                            <div key={article.id} className="small-article-container-outer">
                                <SmallArticle
                                    id={article.id}
                                    title={article.title}
                                    category={article.category}
                                    author={article.author}
                                    date={article.date}
                                    imagePath={article.imagePath}
                                    caption={article.caption}
                                    showContent={!isMobile}
                                    showHelmet = {false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="see-all">
                    <a href="/category/Σπορ">Δείτε περισσότερα →</a>
                </div>  
            </div>
            <div className="container">
                <h1>ART</h1>
                <div className="latest-articles">
                    <div className="latest-article-large">
                        {artArticles[0] && (
                            <Article
                                key={artArticles[0].id}
                                id={artArticles[0].id}
                                title={artArticles[0].title}
                                content={artArticles[0].content}
                                category={artArticles[0].category}
                                author={artArticles[0].author}
                                date={artArticles[0].date}
                                imagePath={artArticles[0].imagePath}
                                caption={artArticles[0].caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        )}
                    </div>
                    <div className="latest-articles-small">
                        {artArticles.slice(1, 4).map(article => (
                            <div key={article.id} className="small-article-container-outer">
                            <SmallArticle
                                id={article.id}
                                title={article.title}
                                category={article.category}
                                author={article.author}
                                date={article.date}
                                imagePath={article.imagePath}
                                caption={article.caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                            </div>
                        ))}
                        <div className="see-all">
                            <a href="/category/Art">Δείτε περισσότερα →</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <h1>PET</h1>
                <div className="kosmos-articles">
                    <div className="kosmos-articles-small">
                        {petArticles.slice(0, 2).map(article => (
                            <SmallArticle
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                category={article.category}
                                author={article.author}
                                date={article.date}
                                imagePath={article.imagePath}
                                caption={article.caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        ))}
                    </div>
                    <div className="kosmos-article-large">
                        {petArticles[3] && (
                            <Article
                                key={petArticles[3].id}
                                id={petArticles[3].id}
                                title={petArticles[3].title}
                                content={petArticles[3].content}
                                category={petArticles[3].category}
                                author={petArticles[3].author}
                                date={petArticles[3].date}
                                imagePath={petArticles[3].imagePath}
                                caption={petArticles[3].caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        )}
                        <div className="see-all">
                            <a href="/category/Pet">Δείτε περισσότερα →</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <h1>ΥΓΕΙΑ/ ΣΥΝΤΑΞΕΙΣ</h1>
                <div className="politismos-articles">
                    <div className="politismos-article-large">
                        {ygeiaSyntaxeisArticles[0] && (
                            <Article
                                key={ygeiaSyntaxeisArticles[0].id}
                                id={ygeiaSyntaxeisArticles[0].id}
                                title={ygeiaSyntaxeisArticles[0].title}
                                content={ygeiaSyntaxeisArticles[0].content}
                                category={ygeiaSyntaxeisArticles[0].category}
                                author={ygeiaSyntaxeisArticles[0].author}
                                date={ygeiaSyntaxeisArticles[0].date}
                                imagePath={ygeiaSyntaxeisArticles[0].imagePath}
                                caption={ygeiaSyntaxeisArticles[0].caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        )}
                    </div>
                    <div className="politismos-articles-small-columns">
                        {ygeiaSyntaxeisArticles.slice(1, 5).map((article, index) => (
                            <div key={article.id} className="small-article-column">
                                <SmallArticle
                                    id={article.id}
                                    title={article.title}
                                    category={article.category}
                                    author={article.author}
                                    date={article.date}
                                    imagePath={article.imagePath}
                                    caption={article.caption}
                                    showContent={!isMobile}
                                    showHelmet = {false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="see-all">
                    <a href="/category/Υγεία_Συντάξεις">Δείτε περισσότερα →</a>
                </div>  
            </div>
            <div className="container">
                <h1>ΕΡΓΑΣΙΑ</h1>
                <div className="oikonomia-articles">
                    <div className="oikonomia-articles-small-columns">
                        {ergasiaArticles.slice(0, 4).map((article, index) => (
                            <div key={article.id} className="small-article-column">
                                <SmallArticle
                                    id={article.id}
                                    title={article.title}
                                    category={article.category}
                                    author={article.author}
                                    date={article.date}
                                    imagePath={article.imagePath}
                                    caption={article.caption}
                                    showContent={!isMobile}
                                    showHelmet = {false}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="oikonomia-article-large">
                        {ergasiaArticles[4] && (
                            <Article
                                key={ergasiaArticles[4].id}
                                id={ergasiaArticles[4].id}
                                title={ergasiaArticles[4].title}
                                content={ergasiaArticles[4].content}
                                category={ergasiaArticles[4].category}
                                author={ergasiaArticles[4].author}
                                date={ergasiaArticles[4].date}
                                imagePath={ergasiaArticles[4].imagePath}
                                caption={ergasiaArticles[0].caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        )}
                    </div>
                </div>
                <div className="see-all">
                    <a href="/category/Εργασία">Δείτε περισσότερα →</a>
                </div>  
            </div>
            <div className="container">
                <h1>ΔΙΚΑΣΤΙΚΑ</h1>
                <div className="latest-articles">
                    <div className="latest-article-large">
                        {dikastikaArticles[0] && (
                            <Article
                                key={dikastikaArticles[0].id}
                                id={dikastikaArticles[0].id}
                                title={dikastikaArticles[0].title}
                                content={dikastikaArticles[0].content}
                                category={dikastikaArticles[0].category}
                                author={dikastikaArticles[0].author}
                                date={dikastikaArticles[0].date}
                                imagePath={dikastikaArticles[0].imagePath}
                                caption={dikastikaArticles[0].caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                        )}
                    </div>
                    <div className="latest-articles-small">
                        {dikastikaArticles.slice(1, 4).map(article => (
                            <div key={article.id} className="small-article-container-outer">
                            <SmallArticle
                                id={article.id}
                                title={article.title}
                                category={article.category}
                                author={article.author}
                                date={article.date}
                                imagePath={article.imagePath}
                                caption={article.caption}
                                showContent={!isMobile}
                                showHelmet = {false}
                            />
                            </div>
                        ))}
                        <div className="see-all">
                            <a href="/category/Δικαστικά">Δείτε περισσότερα →</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
