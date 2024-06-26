import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
    collection,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyAaWoCuGyFmgvQgCxzvZedhVGsK-QMnjf0",
    authDomain: "news-website-a1a1d.firebaseapp.com",
    projectId: "news-website-a1a1d",
    storageBucket: "news-website-a1a1d.appspot.com",
    messagingSenderId: "900434350719",
    appId: "1:900434350719:web:e9cd804d9d64399c79654a",
    measurementId: "G-CXVMG5X08Y"
  };


const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
export const db = getFirestore();
const analytics = getAnalytics(firebaseApp);
export const storage = getStorage(firebaseApp);

export const attemptLogin = async (username,password) => {
    try {
      await signInWithEmailAndPassword(auth,username, password);
  
      const uid = auth.currentUser.uid;
      
      console.log('Logged in successfully!');
      return uid;
  
    } catch (error) {
      console.error('Error logging in:', error.message);
      return false;
    }
  };

  export const fetchArticles = async (collectionKey) => {
    const articlesRef = collection(db, collectionKey); // Assuming collectionKey is the name of your collection
    const dateRef = doc(articlesRef, "24-06-2024"); // Example document ID, adjust according to your structure
    const dateDoc = await getDoc(dateRef);
    if (dateDoc.exists()) {
      const articles = dateDoc.data().articles;
      console.log("Fetched articles:", articles);
      return articles;
    }
  
    console.log("Date doc does not exist or no articles found.");
    return [];
  };

  export const fetchArticlesByCategory = async (collectionKey,category) => {
    const articlesRef = collection(db, collectionKey); // Assuming collectionKey is the name of your collection
    const dateRef = doc(articlesRef, "24-06-2024"); // Example document ID, adjust according to your structure
    const dateDoc = await getDoc(dateRef);
    if (dateDoc.exists()) {
      const articles = dateDoc.data().articles;
    const filteredArticles = articles.filter(article => article.category === category);
    console.log("Fetched articles:", filteredArticles);
    return filteredArticles;
    }
  
    console.log("Date doc does not exist or no articles found.");
    return [];
  };

  export const fetchArticleById = async (collectionKey, article_id) => {

    const articlesRef = collection(db, collectionKey);
    const dateRef = doc(articlesRef, "24-06-2024");
    const dateDoc = await getDoc(dateRef);
    
    if (dateDoc.exists()) {
  
      const articles = dateDoc.data().articles;
  
      console.log(article_id)
      const article = articles.find(article => article.id === article_id);
      
      return article; // Return the found order or null if not found
  
    } else {
      console.log(`Error while fetching date doc`);
      return null; // Return null or handle the error case appropriately
    }
  
  };

  export const addNewArticle = async (collectionKey, title, content, category, imagePath) => {

  
    const articlesRef = collection(db, collectionKey);
    const dateRef = doc(articlesRef, "24-06-2024");
    const infoRef = doc(articlesRef, "info");
    try {
        
      const dateDoc = await getDoc(dateRef);
      const infoDoc = await getDoc(infoRef);
      
      if (dateDoc.exists() && infoDoc.exists()) {
  
        const articles = dateDoc.data().articles;
        const currentId = infoDoc.data().article_id_counter+1;
  
  
        articles.push({
          title: title,
          content: content,
          category: category,
          imagePath: imagePath,
          id: currentId
        });
  
  
        await updateDoc(infoRef, {
          'article_id_counter': currentId
        });
  
        console.log(dateRef);
        console.log(articles);
  
        await updateDoc(dateRef, {
          'articles': articles
        });
  
        console.log(`Added new article with id ${currentId-1}`);
      } else {
        console.log(`Date or info doc does not exist.`);
      }
  
    } catch (error) {
  
      console.error("Error current date or data", error);
  
    }
  
  };

  export const editArticle = async (collectionKey, article) => {

  
    const articlesRef = collection(db, collectionKey);
    const dateRef = doc(articlesRef, "24-06-2024");
    const dateDoc = await getDoc(dateRef);
  
    if (dateDoc.exists()) {
    const articles = dateDoc.data().articles;

    // Check if an order with the same reservation_id already exists
    const existingArticleIndex = articles.findIndex(art => art.id === article.id);

    if (existingArticleIndex !== -1) {
        // Update the existing order
        articles[existingArticleIndex] = article;
    }
    else {
        console.log("Article not found");
    }

// Update the document with the modified orders array
    await updateDoc(dateRef, { articles: articles });

    }

    return "Article updated succesfully";

  };