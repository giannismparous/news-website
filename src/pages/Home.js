import React, { useState, useEffect } from 'react';
import { fetchArticles, fetchArticlesByCategory } from '../firebase/firebaseConfig';
import Article from '../components/Article';
import SmallArticle from '../components/SmallArticle';
import '../styles/Home.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [trendingArticles, setTrendingArticles] = useState([]);
    const [politismosArticles, setPolitismosArticles] = useState([]);
    const [oikonomiaArticles, setOikonomiaArticles] = useState([]);
    const [koinoniaArticles, setKoinoniaArticles] = useState([]);
    const [politikiArticles, setPolitikiArticles] = useState([]);
    const [mediaArticles, setMediaArticles] = useState([]);
    const [diethniArticles, setDiethniArticles] = useState([]);
    const [gnwsiArticles, setGnwsiArticles] = useState([]);

    const fetchArticlesFromServer = async () => {
        try {
            const fetchedArticles = await fetchArticles('articles');
            setArticles([...fetchedArticles].reverse());
            setTrendingArticles([...fetchedArticles].reverse().slice(0, 3)); // Assuming the latest articles are at the top
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };


    const fetchPolitismosArticles = async () => {
        try {
            const fetchedPolitismosArticles = await fetchArticlesByCategory('articles', 'Πολιτισμός');
            setPolitismosArticles([...fetchedPolitismosArticles].reverse().slice(0, 5));
        } catch (error) {
            console.error('Error fetching Πολιτισμός articles:', error);
        }
    };

    const fetchOikonomiaArticles = async () => {
        try {
            const fetchedOikonomiaArticles = await fetchArticlesByCategory('articles', 'Οικονομία');
            setOikonomiaArticles([...fetchedOikonomiaArticles].reverse().slice(0, 5)); // Fetching top 5 articles for Οικονομία
        } catch (error) {
            console.error('Error fetching Οικονομία articles:', error);
        }
    };

    const fetchKoinoniaArticles = async () => {
        try {
            const fetchedKoinoniaArticles = await fetchArticlesByCategory('articles', 'Κοινωνία');
            setKoinoniaArticles([...fetchedKoinoniaArticles].reverse().slice(0, 9)); // Fetching top 9 articles for Κοινωνία (3x3 grid)
        } catch (error) {
            console.error('Error fetching Κοινωνία articles:', error);
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

    const fetchMediaArticles = async () => {
        try {
            const fetchedMediaArticles = await fetchArticlesByCategory('articles', 'Media');
            setMediaArticles([...fetchedMediaArticles].reverse().slice(0, 9)); // Fetching top 9 articles for Κοινωνία (3x3 grid)
        } catch (error) {
            console.error('Error fetching Media articles:', error);
        }
    };

    const fetchDiethniArticles = async () => {
        try {
            const fetchedDiethniArticles = await fetchArticlesByCategory('articles', 'Διεθνή');
            setDiethniArticles([...fetchedDiethniArticles].reverse().slice(0, 9)); // Fetching top 9 articles for Κοινωνία (3x3 grid)
        } catch (error) {
            console.error('Error fetching Διεθνή articles:', error);
        }
    };

    const fetchGnwsiArticles = async () => {
        try {
            const fetchedGnwsiArticles = await fetchArticlesByCategory('articles', 'Πολιτική');
            setGnwsiArticles([...fetchedGnwsiArticles].reverse().slice(0, 9)); // Fetching top 9 articles for Κοινωνία (3x3 grid)
        } catch (error) {
            console.error('Error fetching Γνώση articles:', error);
        }
    };

    useEffect(() => {
        fetchArticlesFromServer();
        fetchPolitismosArticles();
        fetchOikonomiaArticles();
        fetchKoinoniaArticles(); // Fetch Κοινωνία articles
        fetchPolitikiArticles();
        fetchMediaArticles();
        fetchDiethniArticles();
        fetchGnwsiArticles();
    }, []);

    const latestArticles = articles.slice(0, 4);

    return (
        <>
            <div className="trending-container">
                <Carousel showThumbs={false} autoPlay infiniteLoop>
                    {trendingArticles.map(article => (
                        <div key={article.id} className="carousel-article" style={{ backgroundImage: `url(${article.imagePath})` }}>
                            <Link to={`/articles/${article.id}`} className="article-link">
                            <div className="carousel-caption">
                                {/* <p>{article.category}</p> */}
                                <p>ΕΚΤΟΣ ΣΥΝΟΡΩΝ</p>
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
                            />
                        )}
                    </div>
                    <div className="latest-articles-small">
                        {latestArticles.slice(1, 4).map(article => (
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
                        <div className="see-all">
                            <a href="/">Δείτε περισσότερα →</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <h1>Διεθνή</h1>
                <div className="kosmos-articles">
                    <div className="kosmos-articles-small">
                        {diethniArticles.slice(0, 2).map(article => (
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
                    <div className="kosmos-article-large">
                        {diethniArticles[3] && (
                            <Article
                                key={diethniArticles[3].id}
                                id={diethniArticles[3].id}
                                title={diethniArticles[3].title}
                                content={diethniArticles[3].content}
                                category={diethniArticles[3].category}
                                author={diethniArticles[3].author}
                                date={diethniArticles[3].date}
                                imagePath={diethniArticles[3].imagePath}
                            />
                        )}
                        <div className="see-all">
                            <a href="/">Δείτε περισσότερα →</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <h1>Πολιτισμός</h1>
                <div className="politismos-articles">
                    <div className="politismos-article-large">
                        {politismosArticles[0] && (
                            <Article
                                key={politismosArticles[0].id}
                                id={politismosArticles[0].id}
                                title={politismosArticles[0].title}
                                content={politismosArticles[0].content}
                                category={politismosArticles[0].category}
                                author={politismosArticles[0].author}
                                date={politismosArticles[0].date}
                                imagePath={politismosArticles[0].imagePath}
                            />
                        )}
                    </div>
                    <div className="politismos-articles-small-columns">
                        {politismosArticles.slice(1, 5).map((article, index) => (
                            <div className="small-article-column" key={article.id}>
                                <SmallArticle
                                    id={article.id}
                                    title={article.title}
                                    category={article.category}
                                    author={article.author}
                                    date={article.date}
                                    imagePath={article.imagePath}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="see-all">
                    <a href="/">Δείτε περισσότερα →</a>
                </div>  
            </div>
            <div className="container">
                <h1>Οικονομία</h1>
                <div className="oikonomia-articles">
                    <div className="oikonomia-articles-small-columns">
                        {oikonomiaArticles.slice(0, 4).map((article, index) => (
                            <div className="small-article-column" key={article.id}>
                                <SmallArticle
                                    id={article.id}
                                    title={article.title}
                                    category={article.category}
                                    author={article.author}
                                    date={article.date}
                                    imagePath={article.imagePath}
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
                            />
                        )}
                    </div>
                </div>
                <div className="see-all">
                    <a href="/">Δείτε περισσότερα →</a>
                </div>  
            </div>
            <div className="container">
                <h1>Πολιτική</h1>
                <div className="latest-articles">
                    <div className="latest-article-large">
                        {politikiArticles[0] && (
                            <Article
                                key={politikiArticles[0].id}
                                id={politikiArticles[0].id}
                                title={politikiArticles[0].title}
                                content={politikiArticles[0].content}
                                category={politikiArticles[0].category}
                                author={politikiArticles[0].author}
                                date={politikiArticles[0].date}
                                imagePath={politikiArticles[0].imagePath}
                            />
                        )}
                    </div>
                    <div className="latest-articles-small">
                        {politikiArticles.slice(1, 4).map(article => (
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
                        <div className="see-all">
                            <a href="/">Δείτε περισσότερα →</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <h1>Κοινωνία</h1>
                <div className="koinonia-articles">
                    <div className="koinonia-article-large">
                        {koinoniaArticles.slice(0, 3).map(article => (
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
                        {koinoniaArticles.slice(3, 6).map(article => (
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
                        {koinoniaArticles.slice(6, 9).map(article => (
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
            <div className="container">
                <h1>Media</h1>
                <div className="oikonomia-articles">
                    <div className="oikonomia-articles-small-columns">
                        {mediaArticles.slice(0, 4).map((article, index) => (
                            <div className="small-article-column" key={article.id}>
                                <SmallArticle
                                    id={article.id}
                                    title={article.title}
                                    category={article.category}
                                    author={article.author}
                                    date={article.date}
                                    imagePath={article.imagePath}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="oikonomia-article-large">
                        {mediaArticles[4] && (
                            <Article
                                key={mediaArticles[4].id}
                                id={mediaArticles[4].id}
                                title={mediaArticles[4].title}
                                content={mediaArticles[4].content}
                                category={mediaArticles[4].category}
                                author={mediaArticles[4].author}
                                date={mediaArticles[4].date}
                                imagePath={mediaArticles[4].imagePath}
                            />
                        )}
                    </div>
                </div>
                <div className="see-all">
                    <a href="/">Δείτε περισσότερα →</a>
                </div>  
            </div>
            <div className="container">
                <h1>Διεθνή</h1>
                <div className="latest-articles">
                    <div className="latest-article-large">
                        {diethniArticles[0] && (
                            <Article
                                key={diethniArticles[0].id}
                                id={diethniArticles[0].id}
                                title={diethniArticles[0].title}
                                content={diethniArticles[0].content}
                                category={diethniArticles[0].category}
                                author={diethniArticles[0].author}
                                date={diethniArticles[0].date}
                                imagePath={diethniArticles[0].imagePath}
                            />
                        )}
                    </div>
                    <div className="latest-articles-small">
                        {diethniArticles.slice(1, 4).map(article => (
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
                        <div className="see-all">
                            <a href="/">Δείτε περισσότερα →</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <h1>Γνώση</h1>
                <div className="koinonia-articles">
                    <div className="koinonia-article-large">
                        {gnwsiArticles.slice(0, 3).map(article => (
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
                        {gnwsiArticles.slice(3, 6).map(article => (
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
                        {gnwsiArticles.slice(6, 9).map(article => (
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

export default Home;
