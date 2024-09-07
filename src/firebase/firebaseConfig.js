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
import axios from 'axios';


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

const getCurrentDateInGreece = () => {
  const date = new Date();

  // Options for the date formatting
  const options = {
    timeZone: 'Europe/Athens',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  // Format the date
  const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);

  // Split the formatted date to get separate date and time
  const [day, month, yearAndTime] = formattedDate.split('/');
  const [year, time] = yearAndTime.split(', ');

  // Return the formatted date as "dd/mm/yyyy | hh:mm"
  return `${day}/${month}/${year} | ${time}`;
};

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
    case 'all':
    return 'Όλα τα δημοσιεύματα';
    default:
      return name;
  }
};

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
      const articlesData = dateDoc.data().articles;
      const articles = articlesData.filter(article => !article.deleted);
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
      const articlesData = dateDoc.data().articles;
      const articles = articlesData.filter(article => !article.deleted);
      const filteredArticles = articles.filter(article => article.category === category);
      console.log("Fetched articles:", filteredArticles);
    return filteredArticles;
    }
  
    console.log("Date doc does not exist or no articles found.");
    return [];
  };

// export const fetchLastArticlesByCategory = async (collectionKey, category, num) => {
//     const articlesRef = collection(db, collectionKey); // Assuming collectionKey is the name of your collection

//     const articlesQuery = query(
//         articlesRef,
//         where("category", "==", category),
//         orderBy("id", "desc"),
//         limit(num)
//     );

//     try {
//         const querySnapshot = await getDocs(articlesQuery);
//         const articles = querySnapshot.docs.map(doc => doc.data());
//         const filteredArticles = articles.filter(article => !article.deleted);

//         console.log("Fetched articles:", filteredArticles);
//         return filteredArticles;
//     } catch (error) {
//         console.error("Error fetching articles:", error);
//         return [];
//     }
// };

export const fetchArticlesByTitle = async (collectionKey, query) => {
  const articlesRef = collection(db, collectionKey);
  const dateRef = doc(articlesRef, "24-06-2024"); // Adjust the date accordingly
  const dateDoc = await getDoc(dateRef);

  if (dateDoc.exists()) {
    const articlesData = dateDoc.data().articles;
    const articles = articlesData.filter(article => !article.deleted);

    // Normalize the query
    const normalizedQuery = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // Filter articles by normalized title
    const filteredArticles = articles.filter(article => {
      const normalizedTitle = article.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return normalizedTitle.includes(normalizedQuery);
    });

    console.log("Fetched articles by title:", filteredArticles);
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
      const article = articles.find(art => art.id === article_id);
      return article; // Return the found order or null if not found
  
    } else {
      console.log(`Error while fetching date doc`);
      return null; // Return null or handle the error case appropriately
    }
  
  };

// Your sendNewsletterAndUpdate function
export const sendNewsletterAndUpdate = async (collectionKey, article_id, groupIds) => {
  try {
    // Fetch the article by ID
    const article = await fetchArticleById(collectionKey, article_id);
    if (!article) {
      throw new Error('Article not found');
    }

    const strippedContent = article.content.replace(/<[^>]*>?/gm, '');
    const words = strippedContent.split(' ');
    const displayContent = words.slice(0, 50).join(' ')+"...";

    console.log(1111)
    try {
      const response = await fetch('/.netlify/functions/sendNewsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Authorization': `Bearer nfp_3Pyg2D92Bwsxk2zfCFfQ34mJEVURpkRrb1ce`
        },
        body: JSON.stringify({
          id: article.id,
          title: article.title,
          category: formatCategoryName(article.category),
          date: article.date,
          content: displayContent,
          authorPrefix: article.authorPrefix,
          author: article.author,
          authorImagePath: article.authorImagePath,
          imagePath: article.imagePath,
          groupIds: groupIds
        }),
      });
      console.log(2222)
      const data = await response;
      console.log(33333)
      if (response.ok) {
        console.log('Newsletter sent successfully:', data);
        // Update the mailSent status in your Firebase as needed
        const articlesRef = collection(db, collectionKey);
        const dateRef = doc(articlesRef, "24-06-2024");
        const dateDoc = await getDoc(dateRef);
    
        if (dateDoc.exists()) {
          const articles = dateDoc.data().articles;

          // Determine which mailSentTest variable(s) to update
          const updatedArticles = articles.map(art => {
            if (art.id === article_id) {
              let updatedArticle = { ...art };
              
              if (groupIds.includes(process.env.REACT_APP_MAILERLITE_API_TEST1_GROUP_ID)) {
                updatedArticle.mailSentTest1 = true;
              }
              if (groupIds.includes(process.env.REACT_APP_MAILERLITE_API_TEST2_GROUP_ID)) {
                updatedArticle.mailSentTest2 = true;
              }

              if (groupIds.includes(process.env.REACT_APP_MAILERLITE_API_GROUP1_ID)) {
                updatedArticle.mailSentGroup1 = true;
              }
              if (groupIds.includes(process.env.REACT_APP_MAILERLITE_API_GROUP2_ID)) {
                updatedArticle.mailSentGroup2 = true;
              }
              if (groupIds.includes(process.env.REACT_APP_MAILERLITE_API_GROUP3_ID)) {
                updatedArticle.mailSentGroup3 = true;
              }

              return updatedArticle;
            }
            return art;
          });
          
          await updateDoc(dateRef, { articles: updatedArticles });
          console.log('mailSent variable updated');

          return true;
        }
        console.log(44444)
      } else {
        console.error('Failed to send newsletter:', data);
        return false;
      }
      console.log(5555)
      return false;

    } catch (error) {
      console.error('Error while sending the newsletter:', error);
      throw error;
    }

  } catch (error) {
    console.error('Error in sendNewsletterAndUpdate:', error);
    throw error;
  }
};


  export const addNewArticle = async (collectionKey, newArticle) => {
  const articlesRef = collection(db, collectionKey);
  const dateRef = doc(articlesRef, "24-06-2024");
  const infoRef = doc(articlesRef, "info");
  try {
    const dateDoc = await getDoc(dateRef);
    const infoDoc = await getDoc(infoRef);

    if (dateDoc.exists() && infoDoc.exists()) {
      const articles = dateDoc.data().articles;
      const currentId = infoDoc.data().article_id_counter + 1;
      const currentDate = getCurrentDateInGreece();

      if (newArticle.category==="Απόψεις"){
        articles.push({
          title: newArticle.title,
          content: newArticle.content,
          category: newArticle.category,
          imagePath: newArticle.imagePath,
          id: currentId,
          date: currentDate,
          uid: newArticle.uid,
          author: newArticle.author,
          authorPrefix: newArticle.authorPrefix,
          authorImagePath: newArticle.authorImagePath,
          trending: newArticle.trending
        });
      }
      else {
        articles.push({
          title: newArticle.title,
          content: newArticle.content,
          category: newArticle.category,
          imagePath: newArticle.imagePath,
          id: currentId,
          date: currentDate,
          uid: newArticle.uid,
          trending: newArticle.trending,
          author: newArticle.author,
          authorPrefix: newArticle.authorPrefix,
          // authorImagePath: newArticle.authorImagePath
        });
      }
      

      await updateDoc(infoRef, {
        article_id_counter: currentId
      });

      await updateDoc(dateRef, {
        articles: articles
      });

      console.log(`Added new article with id ${currentId}`);
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

  export const deleteArticle = async (collectionKey, article) => {

  
    const articlesRef = collection(db, collectionKey);
    const dateRef = doc(articlesRef, "24-06-2024");
    const dateDoc = await getDoc(dateRef);
  
    if (dateDoc.exists()) {
    const articles = dateDoc.data().articles;
    // Check if an order with the same reservation_id already exists
    const existingArticleIndex = articles.findIndex(art => art.id === article.id);

    if (existingArticleIndex !== -1) {
        // Update the existing order
        articles[existingArticleIndex].deleted=true;
    }
    else {
        console.log("Article not found");
    }

// Update the document with the modified orders array
    await updateDoc(dateRef, { articles: articles });

    }

    return "Article deleted succesfully";

  };