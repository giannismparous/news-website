import React, { useState, useEffect } from 'react';
import '../styles/ArticleEditor.css';
import ArticleEditor from '../components/ArticleEditor';
import Article from '../components/Article';
import Login from '../components/Login';
import { fetchArticles, deleteArticle, sendNewsletterAndUpdate } from '../firebase/firebaseConfig';
import { ClockLoader } from 'react-spinners';
import { FacebookShareButton} from 'react-share';
import { FacebookIcon} from 'react-share';
import '../styles/Admin.css'; // Import the Admin CSS

const Admin = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uid, setUid] = useState(null); // Add uid state
  const [articles, setArticles] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleToDelete, setArticleToDelete] = useState(null);

  const [loading, setLoading] = useState(false);

  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const reset = () => {
    window.scrollTo(0, 0);
    if (showEditor) setSelectedArticle(null);
    setShowEditor(!showEditor);
  };

  const fetchArticlesFromServer = async () => {
    try {
      const fetchedArticles = await fetchArticles('articles'); // Pass your collection key here
      setArticles([...fetchedArticles].reverse());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      window.scrollTo(0, 0);
      setLoading(true);
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

  const handleSendNewsletter = async (article, groupIds) => {
    try {
      setShowNewsletterPopup(false);
      setLoading(true);
      const result=await sendNewsletterAndUpdate('articles', article.id, groupIds); // Update with selected group IDs
      if (result){
        alert('Το newsletter στάλθηκε επιτυχώς!');
      }
      else {
        alert('Σφάλμα. Η αποστολή newsletter απέτυχε!');
      }
      fetchArticlesFromServer();
      setShowNewsletterPopup(false); // Close the popup after sending
      setLoading(true);
      setSelectedGroups([]);
    } catch (error) {
      setSelectedGroups([]);
      alert('Σφάλμα. Η αποστολή newsletter απέτυχε!');
      console.error('Error sending newsletter:', error);
    }
  };

  const openNewsletterPopup = (article) => {
    setShowNewsletterPopup(true);
    setSelectedArticle(article)
    console.log(newsletterGroups)
  };

  const closeNewsletterPopup = () => {
    setSelectedArticle();
    setSelectedGroups([]);
    setShowNewsletterPopup(false);
  };

  const toggleGroupSelection = (groupId) => {
    setSelectedGroups((prevSelectedGroups) => {
      if (prevSelectedGroups.includes(groupId)) {
        return prevSelectedGroups.filter((id) => id !== groupId);
      } else {
        return [...prevSelectedGroups, groupId];
      }
    });
  };

  const newsletterGroups = [
    {
      id: process.env.REACT_APP_MAILERLITE_API_TEST1_GROUP_ID,
      name: process.env.REACT_APP_MAILERLITE_API_TEST1_GROUP_NAME
    },
    {
      id: process.env.REACT_APP_MAILERLITE_API_TEST2_GROUP_ID,
      name: process.env.REACT_APP_MAILERLITE_API_TEST2_GROUP_NAME
    },
    {
      id: process.env.REACT_APP_MAILERLITE_API_GROUP1_ID,
      name: process.env.REACT_APP_MAILERLITE_API_GROUP1_NAME
    },
    {
      id: process.env.REACT_APP_MAILERLITE_API_GROUP2_ID,
      name: process.env.REACT_APP_MAILERLITE_API_GROUP2_NAME
    }
    ,
    {
      id: process.env.REACT_APP_MAILERLITE_API_GROUP3_ID,
      name: process.env.REACT_APP_MAILERLITE_API_GROUP3_NAME
    }
  ];

  return (
    <div className="admin-container">
      {loading &&
        <div className='article-editor-loader'>
          <ClockLoader color="#e29403d3" loading={loading} size={150} />
        </div>
      }
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
                  <div className='send-article-section'>
                    <div className='sent-to'>
                      {/* {article.mailSentTest1===true && (
                        <p className='newsletter'>Έχει αποσταλεί ως newsletter στο Test1✔️</p>
                        // <button className="newsletter-button newsletter" onClick={() => openNewsletterPopup(article)}>Αποστολή ως Newsletter</button>
                      )}
                      {article.mailSentTest2===true && (
                        <p className='newsletter'>Έχει αποσταλεί ως newsletter στο Test2✔️</p>
                        // <button className="newsletter-button newsletter" onClick={() => openNewsletterPopup(article)}>Αποστολή ως Newsletter</button>
                      ) } */}
                      {article.mailSentGroup1===true && (
                        <p className='newsletter'>Έχει αποσταλεί ως newsletter στο MELH(124)✔️</p>
                        // <button className="newsletter-button newsletter" onClick={() => openNewsletterPopup(article)}>Αποστολή ως Newsletter</button>
                      )}
                      {article.mailSentGroup2===true && (
                        <p className='newsletter'>Έχει αποσταλεί ως newsletter στο AUGOUSTOS_XWRIS_SYNENAISI(451)✔️</p>
                        // <button className="newsletter-button newsletter" onClick={() => openNewsletterPopup(article)}>Αποστολή ως Newsletter</button>
                      ) }
                      {article.mailSentGroup3===true && (
                        <p className='newsletter'>Έχει αποσταλεί ως newsletter στο AUGOUSTOS_ME_SYNENAISI(270)✔️</p>
                        // <button className="newsletter-button newsletter" onClick={() => openNewsletterPopup(article)}>Αποστολή ως Newsletter</button>
                      ) }
                    </div>
                    {!(article.mailSentGroup1===true && article.mailSentGroup2===true && article.mailSentGroup3===true) && <button className="newsletter-button newsletter" onClick={() => openNewsletterPopup(article)}>Αποστολή ως Newsletter</button>}
                    <FacebookShareButton url={`www.syntaktes.gr/articles/${article.id}`} quote={article.title} hashtag={`#${article.category}`}>
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                  </div>
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
      {showNewsletterPopup && (
        <div className="newsletter-popup-background">
          <div className="newsletter-popup">
            <h2>Επιλέξτε ομάδες για αποστολή Newsletter:</h2>
            <div className="group-options">
              {newsletterGroups.map((group) => {
                const isMailSent =
                (group.id === process.env.REACT_APP_MAILERLITE_API_TEST1_GROUP_ID && selectedArticle.mailSentTest1) ||
                (group.id === process.env.REACT_APP_MAILERLITE_API_TEST2_GROUP_ID && selectedArticle.mailSentTest2) ||
                (group.id === process.env.REACT_APP_MAILERLITE_API_GROUP1_ID && selectedArticle.mailSentGroup1) ||
                (group.id === process.env.REACT_APP_MAILERLITE_API_GROUP2_ID && selectedArticle.mailSentGroup2) ||
                (group.id === process.env.REACT_APP_MAILERLITE_API_GROUP3_ID && selectedArticle.mailSentGroup3);

                return (
                  <label key={group.id}>
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id)}
                      onChange={() => toggleGroupSelection(group.id)}
                      disabled={isMailSent}  // Disable if mail has been sent
                    />
                    {group.name} {isMailSent && '✔️'}
                  </label>
                );
              })}
            </div>
            <div className="popup-actions">
              <button
                className="send-button"
                onClick={() => handleSendNewsletter(selectedArticle, selectedGroups)}
                disabled={selectedGroups.length === 0} // Disable button if no groups are selected
              >
                Αποστολή
              </button>
              <button className="close-button" onClick={closeNewsletterPopup}>Ακύρωση</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
