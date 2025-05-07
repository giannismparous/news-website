import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ClockLoader } from 'react-spinners';
import { FacebookShareButton} from 'react-share';
import { FacebookIcon} from 'react-share';

import ArticleEditor from '../components/ArticleEditor';
import Article from '../components/Article';
import Login from '../components/Login';

import { fetchAdminPage, fetchAdminPageAfter, deleteArticle, sendNewsletterAndUpdate } from '../firebase/firebaseConfig';

import '../styles/Admin.css';

const PAGE_SIZE = 5;

const Admin = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uid, setUid] = useState(null);
  const [articles, setArticles] = useState([]);
  const [lastDoc, setLastDoc]           = useState(null);
  const [hasMore, setHasMore]           = useState(true)
  const [showEditor, setShowEditor] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleToDelete, setArticleToDelete] = useState(null);

  const [loading, setLoading] = useState(false);

  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const loaderRef = useRef(null)

  const reset = () => {
    window.scrollTo(0, 0);
    if (showEditor) setSelectedArticle(null);
    setShowEditor(!showEditor);
  };
  
  const loadFirstPage = useCallback(async () => {
    setLoading(true);
    try {
      const { docs, last } = await fetchAdminPage('articles', PAGE_SIZE);
      setArticles(docs);
      setLastDoc(last);
      setHasMore(docs.length === PAGE_SIZE);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      window.scrollTo(0, 0);
      loadFirstPage();
    }
  }, [isLoggedIn, loadFirstPage]);

   
   useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);
          fetchAdminPageAfter('articles', 'all', lastDoc, PAGE_SIZE)
            .then(({ docs, last }) => {
              setArticles(prev => [...prev, ...docs]);
              setLastDoc(last);
              setHasMore(docs.length === PAGE_SIZE);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 800px 0px',
        threshold: 0.5,
      }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [lastDoc, hasMore, loading]);

  const handleLogin = (uid) => {
    setIsLoggedIn(true);
    setUid(uid);
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setShowEditor(true);
  };

  const handleDelete = async () => {
    try {
      await deleteArticle('articles', articleToDelete);
      loadFirstPage();
      setArticleToDelete(null);
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
      const result=await sendNewsletterAndUpdate('articles', article.id, groupIds);
      if (result){
        alert('Το newsletter στάλθηκε επιτυχώς!');
      }
      else {
        alert('Σφάλμα. Η αποστολή newsletter απέτυχε!');
      }
      loadFirstPage();
      setShowNewsletterPopup(false);
      setLoading(false);
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
    },
    {
      id: process.env.REACT_APP_MAILERLITE_API_GROUP4_ID,
      name: process.env.REACT_APP_MAILERLITE_API_GROUP4_NAME
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
            <ArticleEditor article={selectedArticle} onArticleAdded={() => { loadFirstPage() }} uid={uid} />
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
                    showHelmet = {false}
                  />
                  <button className="edit-button" onClick={() => handleEdit(article)}>Επεξεργασία</button>
                  <button className="delete-button" onClick={() => confirmDelete(article)}>Διαγραφή</button>
                  <div className='send-article-section'>
                    <div className='sent-to'>
                      {article.mailSentGroup1===true && (
                        <p className='newsletter'>Έχει αποσταλεί ως newsletter στο MELH(124)✔️</p>
                      )}
                      {article.mailSentGroup2===true && (
                        <p className='newsletter'>Έχει αποσταλεί ως newsletter στο AUGOUSTOS_XWRIS_SYNENAISI(451)✔️</p>
                      ) }
                      {article.mailSentGroup3===true && (
                        <p className='newsletter'>Έχει αποσταλεί ως newsletter στο AUGOUSTOS_ME_SYNENAISI(270)✔️</p>
                      ) }
                      {article.mailSentGroup4===true && (
                        <p className='newsletter'>Έχει αποσταλεί ως newsletter στο NEA_LISTA(1123)✔️</p>
                      ) }
                    </div>
                    {!(article.mailSentGroup1===true && article.mailSentGroup2===true && article.mailSentGroup3===true && article.mailSentGroup4===true) && <button className="newsletter-button newsletter" onClick={() => openNewsletterPopup(article)}>Αποστολή ως Newsletter</button>}
                    <FacebookShareButton url={`www.syntaktes.gr/articles/${article.id}`} quote={article.title} hashtag={`#${article.category}`}>
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                  </div>
                </div>
              ))}
              <div ref={loaderRef} style={{ height: '1px' }} />
              {!hasMore && (
                <p style={{ textAlign: 'center', margin: '1rem 0' }}>
                  — Δεν υπάρχουν άλλα άρθρα —
                </p>
              )}
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
                (group.id === process.env.REACT_APP_MAILERLITE_API_GROUP3_ID && selectedArticle.mailSentGroup3) ||
                (group.id === process.env.REACT_APP_MAILERLITE_API_GROUP4_ID && selectedArticle.mailSentGroup4);

                return (
                  <label key={group.id}>
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id)}
                      onChange={() => toggleGroupSelection(group.id)}
                      disabled={isMailSent}  
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
                disabled={selectedGroups.length === 0} 
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
