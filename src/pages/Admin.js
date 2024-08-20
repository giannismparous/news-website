import React, { useState, useEffect } from 'react';
import '../styles/ArticleEditor.css';
import ArticleEditor from '../components/ArticleEditor';
import Article from '../components/Article';
import Login from '../components/Login';
import { fetchArticles, deleteArticle } from '../firebase/firebaseConfig';
import '../styles/Admin.css'; // Import the Admin CSS

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uid, setUid] = useState(null); // Add uid state
  const [articles, setArticles] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleToDelete, setArticleToDelete] = useState(null);

  const reset = () => {
    if (showEditor) setSelectedArticle(null);
    setShowEditor(!showEditor);
  };

  const fetchArticlesFromServer = async () => {
    try {
      const fetchedArticles = await fetchArticles('articles'); // Pass your collection key here
      setArticles([...fetchedArticles].reverse());
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchArticlesFromServer();
    }
  }, [isLoggedIn]);

  const handleLogin = (uid) => {
    setIsLoggedIn(true);
    setUid(uid); // Set uid on login
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setShowEditor(true);
  };

  const handleDelete = async () => {
    try {
      await deleteArticle('articles', articleToDelete);
      fetchArticlesFromServer();
      setArticleToDelete(null); // Close the confirmation dialog
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const confirmDelete = (article) => {
    setArticleToDelete(article);
  };
  const cancelDelete = () => {
    setArticleToDelete(null);
  };

  return (
    <div className="admin-container">
      {isLoggedIn && (
        <div className="uid-display">Συνδεδεμένος Χρήστης: {uid}</div> // Display the UID on the top right
      )}
      {isLoggedIn ? (
        <div className="admin-content">
          <div className="new-article-button-container">
            <button className="new-article-button" onClick={reset}>
              {showEditor ? '← Πίσω' : '+ Δημιουργία άρθρου'}
            </button>
          </div>
          {showEditor ? (
            <ArticleEditor article={selectedArticle} onArticleAdded={fetchArticlesFromServer} uid={uid} />
          ) : (
            <div>
              <h1 className="admin-header">Όλες οι δημοσιεύσεις</h1>
              {articles.map((article) => (
                <div key={article.id} className="article-container">
                  <Article
                    id={article.id}
                    title={article.title}
                    content={article.content}
                    category={article.category}
                    imagePath={article.imagePath}
                    authorImagePath={article.authorImagePath}
                    date={article.date}
                    author={article.author}
                    authorPrefix={article.authorPrefix}
                    apopsi={true}
                  />
                  <button className="edit-button" onClick={() => handleEdit(article)}>Επεξεργασία</button>
                  <button className="delete-button" onClick={() => confirmDelete(article)}>Διαγραφή</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
      {articleToDelete && (
        <>
          <div className="backdrop" />
          <div className="confirmation-dialog">
            <p>Είστε σίγουροι ότι θέλετε να διαγράψετε το άρθρο?</p>
            <button className="confirm-button" onClick={handleDelete}>Ναι</button>
            <button className="cancel-button" onClick={cancelDelete}>Όχι</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;
