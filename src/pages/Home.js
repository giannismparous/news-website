import React, { useState, useEffect } from 'react';
import { fetchArticles, fetchArticlesByCategory } from '../firebase/firebaseConfig';
import Article from '../components/Article';
import SmallArticle from '../components/SmallArticle';
import '../styles/Home.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const Home = () => {

    const [articles, setArticles] = useState([]);
    const [trendingArticles, setTrendingArticles] = useState([]);
    const [politikiArticles, setPolitikiArticles] = useState([]);
    const [apopseisArticles, setApopseisArticles] = useState([]);
    const [paraskiniaArticles, setParaskiniaArticles] = useState([]);
    const [kedpressEsheaArticles, setKedpressEsheaArticles] = useState([]);
    const [ektosSynorwnArticles, setEktosSynorwnArticles] = useState([]);
    const [agoraKanalwtesArticles, setAgoraKatanalwtesArticles] = useState([]);
    const [plusLifeArticles, setPlusLifeArticles] = useState([]);
    const [sporArticles, setSporArticles] = useState([]);
    const [artArticles, setArtArticles] = useState([]);
    const [petArticles, setPetArticles] = useState([]);
    const [ygeiaSyntaxeisArticles, setYgeiaSyntaxeisArticles] = useState([]);
    const [ergasiaArticles, setErgasiaArticles] = useState([]);
    const [dikastikaArticles, setDikastikaArticles] = useState([]);

    const fetchArticlesFromServer = async () => {
        try {
            const fetchedArticles = await fetchArticles('articles');
            setArticles([...fetchedArticles].reverse());
            setTrendingArticles([...fetchedArticles].reverse().slice(0, 3)); // Assuming the latest articles are at the top
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    const fetchPolitikiArticles = async () => {
        try {
            const fetchedPolitikiArticles = await fetchArticlesByCategory('articles', 'Πολιτική');
            setPolitikiArticles([...fetchedPolitikiArticles].reverse().slice(0, 9)); // Fetching top 9 articles for Κοινωνία (3x3 grid)
        } catch (error) {
            console.error('Error fetching Πολιτική articles:', error);
        }
    };

    const fetchApopseisArticles = async () => {
        try {
            const fetchedApopseisArticles = await fetchArticlesByCategory('articles', 'Απόψεις');
            setApopseisArticles([...fetchedApopseisArticles].reverse().slice(0, 9)); // Fetching top 9 articles for Κοινωνία (3x3 grid)
        } catch (error) {
            console.error('Error fetching Απόψεις articles:', error);
        }
    };

    const fetchParaskiniaArticles = async () => {
        try {
            const fetchedParaskiniaArticles = await fetchArticlesByCategory('articles', 'Παρασκήνια');
            setParaskiniaArticles([...fetchedParaskiniaArticles].reverse().slice(0, 9)); // Fetching top 9 articles for Κοινωνία (3x3 grid)
        } catch (error) {
            console.error('Error fetching Παρασκήνια articles:', error);
        }
    };

    const fetchKedpressEsheaArticles = async () => {
        try {
            const fetchedKedpressEsheaArticles = await fetchArticlesByCategory('articles', 'Kedpress_ΕΣΗΕΑ');
            setKedpressEsheaArticles([...fetchedKedpressEsheaArticles].reverse().slice(0, 5));
        } catch (error) {
            console.error('Error fetching Kedpress ΕΣΗΕΑ articles:', error);
        }
    };

    const fetchEktosSynorwnArticles = async () => {
        try {
            const fetchedEktosSynorwnArticles = await fetchArticlesByCategory('articles', 'Εκτός_Συνόρων');
            setEktosSynorwnArticles([...fetchedEktosSynorwnArticles].reverse().slice(0, 5));
        } catch (error) {
            console.error('Error fetching Εκτός Συνόρων articles:', error);
        }
    };

    const fetchAgoraKatanalwtesArticles = async () => {
        try {
            const fetchedAgoraKatanalwtesArticles = await fetchArticlesByCategory('articles', 'Αγορά_Καταναλωτές');
            setAgoraKatanalwtesArticles([...fetchedAgoraKatanalwtesArticles].reverse().slice(0, 5));
        } catch (error) {
            console.error('Error fetching Αγορά/ Καταναλωτές articles:', error);
        }
    };

    const fetchPlusLifeArticles = async () => {
        try {
            const fetchedPlusLifeArticles = await fetchArticlesByCategory('articles', 'Plus_Life');
            setPlusLifeArticles([...fetchedPlusLifeArticles].reverse().slice(0, 5));
        } catch (error) {
            console.error('Error fetching Plus/ Life articles:', error);
        }
    };

    const fetchSporArticles = async () => {
        try {
            const fetchedSporArticles = await fetchArticlesByCategory('articles', 'Σπορ');
            setSporArticles([...fetchedSporArticles].reverse().slice(0, 5));
        } catch (error) {
            console.error('Error fetching Σπορ articles:', error);
        }
    };

    const fetchArtArticles = async () => {
        try {
            const fetchedArtArticles = await fetchArticlesByCategory('articles', 'Art');
            setArtArticles([...fetchedArtArticles].reverse().slice(0, 5));
        } catch (error) {
            console.error('Error fetching Art articles:', error);
        }
    };

    const fetchPetArticles = async () => {
        try {
            const fetchedPetArticles = await fetchArticlesByCategory('articles', 'Pet');
            setPetArticles([...fetchedPetArticles].reverse().slice(0, 5));
        } catch (error) {
            console.error('Error fetching Pet articles:', error);
        }
    };

    const fetchYgeiaSyntaxeisArticles = async () => {
        try {
            const fetchedYgeiaSyntaxeisArticles = await fetchArticlesByCategory('articles', 'Υγεία_Συντάξεις');
            setYgeiaSyntaxeisArticles([...fetchedYgeiaSyntaxeisArticles].reverse().slice(0, 5));
        } catch (error) {
            console.error('Error fetching Υγεία/ Συντάξεις articles:', error);
        }
    };


    const fetchErgasiaArticles = async () => {
        try {
            const fetchedErgasiaArticles = await fetchArticlesByCategory('articles', 'Εργασία');
            setErgasiaArticles([...fetchedErgasiaArticles].reverse().slice(0, 5));
        } catch (error) {
            console.error('Error fetching Εργασία articles:', error);
        }
    };

    const fetchDikastikaArticles = async () => {
        try {
            const fetchedDikastikaArticles = await fetchArticlesByCategory('articles', 'Δικαστικά');
            setDikastikaArticles([...fetchedDikastikaArticles].reverse().slice(0, 5)); // Fetching top 5 articles for Οικονομία
        } catch (error) {
            console.error('Error fetching Δικαστικά articles:', error);
        }
    };


    useEffect(() => {
        fetchArticlesFromServer();
        fetchPolitikiArticles();
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

    const latestArticles = articles.slice(0, 4);

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

    return (
        <>
            <div className="trending-container">
                <Carousel showThumbs={false} autoPlay infiniteLoop>
                    {trendingArticles.map(article => (
                        <div key={article.id} className="carousel-article" style={{ backgroundImage: `url(${article.imagePath})` }}>
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
                                showContent={!isMobile}
                            />
                        )}
                    </div>
                    <div className="latest-articles-small">
                        {latestArticles.slice(1, 4).map(article => (
                            <div className="small-article-container-outer">
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
                            </div>
                        ))}
                        {/* <div className="see-all">
                            <a href="/">Δείτε περισσότερα →</a>
                        </div> */}
                    </div>
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
                                showContent={!isMobile}
                            />
                        ))}
                    </div>
                    <div className="kosmos-article-large">
                        {politikiArticles[3] && (
                            <Article
                                key={politikiArticles[3].id}
                                id={politikiArticles[3].id}
                                title={politikiArticles[3].title}
                                content={politikiArticles[3].content}
                                category={politikiArticles[3].category}
                                author={politikiArticles[3].author}
                                date={politikiArticles[3].date}
                                imagePath={politikiArticles[3].imagePath}
                                showContent={!isMobile}
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
                                authorImagePath={apopseisArticles[0].authorImagePath}
                                date={apopseisArticles[0].date}
                                imagePath={apopseisArticles[0].imagePath}
                                showContent={!isMobile}
                                maxWordsPreview={15}
                            />
                        )}
                        {apopseisArticles[0] && (
                            <Article
                                key={apopseisArticles[0].id}
                                id={apopseisArticles[0].id}
                                title={apopseisArticles[0].title}
                                content={apopseisArticles[0].content}
                                category={apopseisArticles[0].category}
                                author={apopseisArticles[0].author}
                                authorImagePath={apopseisArticles[0].authorImagePath}
                                date={apopseisArticles[0].date}
                                imagePath={apopseisArticles[0].imagePath}
                                showContent={!isMobile}
                                maxWordsPreview={15}
                            />
                        )}
                        {apopseisArticles[0] && (
                            <Article
                                key={apopseisArticles[0].id}
                                id={apopseisArticles[0].id}
                                title={apopseisArticles[0].title}
                                content={apopseisArticles[0].content}
                                category={apopseisArticles[0].category}
                                author={apopseisArticles[0].author}
                                authorImagePath={apopseisArticles[0].authorImagePath}
                                date={apopseisArticles[0].date}
                                imagePath={apopseisArticles[0].imagePath}
                                showContent={!isMobile}
                                maxWordsPreview={15}
                            />
                        )}
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
                            <div className="small-article-column" key={article.id}>
                                <SmallArticle
                                    id={article.id}
                                    title={article.title}
                                    category={article.category}
                                    author={article.author}
                                    date={article.date}
                                    imagePath={article.imagePath}
                                    showContent={!isMobile}
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
                                showContent={!isMobile}
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
                                showContent={!isMobile}
                            />
                        )}
                    </div>
                    <div className="latest-articles-small">
                        {kedpressEsheaArticles.slice(1, 4).map(article => (
                            <div className="small-article-container-outer">
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
                            </div>
                        ))}
                        <div className="see-all">
                            <a href="/category/Kedpress_ΕΣΗΕΑ">Δείτε περισσότερα →</a>
                        </div>
                    </div>
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
                                showContent={!isMobile}
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
                                showContent={!isMobile}
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
                                showContent={!isMobile}
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
                            <div className="small-article-column" key={article.id}>
                                <SmallArticle
                                    id={article.id}
                                    title={article.title}
                                    category={article.category}
                                    author={article.author}
                                    date={article.date}
                                    imagePath={article.imagePath}
                                    showContent={!isMobile}
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
                                showContent={!isMobile}
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
                                showContent={!isMobile}
                            />
                        )}
                    </div>
                    <div className="latest-articles-small">
                        {plusLifeArticles.slice(1, 4).map(article => (
                            <div className="small-article-container-outer">
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
                                showContent={!isMobile}
                            />
                        ))}
                    </div>
                    <div className="koinonia-articles-small">
                        {sporArticles.slice(3, 6).map(article => (
                            <div className="small-article-container-outer">
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
                            </div>
                        ))}
                    </div>
                    <div className="koinonia-articles-small">
                        {sporArticles.slice(6, 9).map(article => (
                            <div className="small-article-container-outer">
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
                                showContent={!isMobile}
                            />
                        )}
                    </div>
                    <div className="latest-articles-small">
                        {artArticles.slice(1, 4).map(article => (
                            <div className="small-article-container-outer">
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
                                showContent={!isMobile}
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
                                showContent={!isMobile}
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
                                showContent={!isMobile}
                            />
                        )}
                    </div>
                    <div className="politismos-articles-small-columns">
                        {ygeiaSyntaxeisArticles.slice(1, 5).map((article, index) => (
                            <div className="small-article-column" key={article.id}>
                                <SmallArticle
                                    id={article.id}
                                    title={article.title}
                                    category={article.category}
                                    author={article.author}
                                    date={article.date}
                                    imagePath={article.imagePath}
                                    showContent={!isMobile}
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
                            <div className="small-article-column" key={article.id}>
                                <SmallArticle
                                    id={article.id}
                                    title={article.title}
                                    category={article.category}
                                    author={article.author}
                                    date={article.date}
                                    imagePath={article.imagePath}
                                    showContent={!isMobile}
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
                                showContent={!isMobile}
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
                                showContent={!isMobile}
                            />
                        )}
                    </div>
                    <div className="latest-articles-small">
                        {dikastikaArticles.slice(1, 4).map(article => (
                            <div className="small-article-container-outer">
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
                            </div>
                        ))}
                        <div className="see-all">
                            <a href="/category/Δικαστικά">Δείτε περισσότερα →</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
