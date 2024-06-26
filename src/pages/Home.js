import React, { useState, useEffect } from 'react';
import { fetchArticles, fetchArticlesByCategory } from '../firebase/firebaseConfig';
import Article from '../components/Article';
import '../styles/Home.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [trendingArticles, setTrendingArticles] = useState([]);
    const [kosmosArticles, setKosmosArticles] = useState([]);
    const [politismosArticles, setPolitismosArticles] = useState([]);

    const fetchArticlesFromServer = async () => {
        try {
            const fetchedArticles = await fetchArticles('articles');
            setArticles(fetchedArticles);
            setTrendingArticles(fetchedArticles.slice(0, 3)); // Assuming the latest articles are at the top
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    const fetchKosmosArticles = async () => {
        try {
            const fetchedKosmosArticles = await fetchArticlesByCategory('articles', 'Κόσμος');
            setKosmosArticles(fetchedKosmosArticles.slice(0, 4));
        } catch (error) {
            console.error('Error fetching Κόσμος articles:', error);
        }
    };

    const fetchPolitismosArticles = async () => {
        try {
            const fetchedPolitismosArticles = await fetchArticlesByCategory('articles', 'Πολιτισμός');
            setPolitismosArticles(fetchedPolitismosArticles.slice(0, 5));
        } catch (error) {
            console.error('Error fetching Πολιτισμός articles:', error);
        }
    };

    useEffect(() => {
        fetchArticlesFromServer();
        fetchKosmosArticles();
        fetchPolitismosArticles();
    }, []);

    const latestArticles = articles.slice(0, 4);

    return (
        <>
            <div className="trending-container">
                <Carousel showThumbs={false} autoPlay infiniteLoop>
                    {trendingArticles.map(article => (
                        <div key={article.id} className="carousel-article" style={{ backgroundImage: `url(${article.imagePath})` }}>
                            <div className="carousel-caption">
                                <h3>{article.title}</h3>
                                <p>{article.category}</p>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
            <div className="container">
                <h1>Τελευταία άρθρα</h1>
                <div className="latest-articles">
                    <div className="latest-article-large">
                        {latestArticles[0] && (
                            <Article
                                key={latestArticles[0].id}
                                id={latestArticles[0].id}
                                title={latestArticles[0].title}
                                content={latestArticles[0].content}
                                category={latestArticles[0].category}
                                imagePath={latestArticles[0].imagePath}
                            />
                        )}
                    </div>
                    <div className="latest-articles-small">
                        {latestArticles.slice(1, 3).map(article => (
                            <Article
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                content={article.content}
                                category={article.category}
                                imagePath={article.imagePath}
                                showContent={false}
                            />
                        ))}
                        <div className="see-all">
                            <a href="/">Δείτε περισσότερα →</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <h1>Κόσμος</h1>
                <div className="kosmos-articles">
                    <div className="latest-articles-small">
                        {kosmosArticles.slice(1, 3).map(article => (
                            <Article
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                content={article.content}
                                category={article.category}
                                imagePath={article.imagePath}
                                showContent={false}
                            />
                        ))}
                    </div>
                    <div className="kosmos-article-large">
                        {kosmosArticles[3] && (
                            <Article
                                key={kosmosArticles[3].id}
                                id={kosmosArticles[3].id}
                                title={kosmosArticles[3].title}
                                content={kosmosArticles[3].content}
                                category={kosmosArticles[3].category}
                                imagePath={kosmosArticles[3].imagePath}
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
                                imagePath={politismosArticles[0].imagePath}
                            />
                        )}
                    </div>
                    <div className="politismos-articles-small">
                        {politismosArticles.slice(1, 3).map(article => (
                            <Article
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                content={article.content}
                                category={article.category}
                                imagePath={article.imagePath}
                                showContent={false}
                            />
                        ))}
                    </div>
                    <div className="politismos-articles-small">
                        {politismosArticles.slice(3, 5).map(article => (
                            <Article
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                content={article.content}
                                category={article.category}
                                imagePath={article.imagePath}
                                showContent={false}
                            />
                        ))}
                        <div className="see-all">
                            <a href="/">Δείτε περισσότερα →</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
