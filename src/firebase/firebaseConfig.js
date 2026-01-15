import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    updateDoc,
    getFirestore,
    serverTimestamp,
    runTransaction,
    startAfter,
    arrayUnion
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
// const analytics = getAnalytics(firebaseApp);
export const storage = getStorage(firebaseApp);

const getCurrentDateInGreece = () => {

  const date = new Date();

  const options = {
    timeZone: 'Europe/Athens',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);

  const [day, month, yearAndTime] = formattedDate.split('/');
  const [year, time] = yearAndTime.split(', ');

  // "dd/mm/yyyy | hh:mm"
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

export function normalize(str = '') {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function makeNgrams(s = '') {
  const words = s.split(/\s+/).filter(Boolean);
  return Array.from(new Set(words));
}

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

export async function addArticle(collectionKey, newArticle) {
  const colRef  = collection(db, collectionKey);
  const infoRef = doc(db, collectionKey, 'info');
  const newDocRef = doc(colRef);

  let articleId = null; // Store the article ID to return

  await runTransaction(db, async (tx) => {
    const infoSnap = await tx.get(infoRef);
    let counter = 0;
    if (!infoSnap.exists()) {
      throw new Error('Missing info doc');
    }
    counter = infoSnap.data().article_id_counter + 1;
    articleId = counter; // Store the counter value
    tx.update(infoRef, { article_id_counter: counter });

    const normTitle = normalize(newArticle.title);
    const ngrams    = makeNgrams(normTitle);
    const date      = getCurrentDateInGreece();

    const payload = {
      id:               counter,
      title:            newArticle.title,
      caption:          newArticle.caption,
      normalizedTitle:  normTitle,
      ngrams,
      content:          newArticle.content,
      category:         newArticle.category,
      imagePath:        newArticle.imagePath,
      author:           newArticle.author,
      authorPrefix:     newArticle.authorPrefix,
      authorImagePath:  newArticle.authorImagePath,
      uid:              newArticle.uid,
      trending:         !!newArticle.trending,
      deleted:          false,
      date,  
      dateTimestamp:    serverTimestamp(),
    };

    tx.set(newDocRef, payload);
  });

  // Return the numeric article ID (counter), not the Firestore document ID
  return articleId;
}

export async function editArticle(collectionKey, updated) {

  const col = collection(db, collectionKey);
  const q = query(col, where('id', '==', updated.id), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) throw new Error(`No article found with id ${updated.id}`);
  const docRef = snap.docs[0].ref;

  const normTitle = normalize(updated.title);
  const ngrams    = makeNgrams(normTitle);

  const payload = {
    title:           updated.title,
    caption:         updated.caption,
    normalizedTitle: normTitle,
    ngrams,
    content:         updated.content,
    category:        updated.category,
    imagePath:       updated.imagePath,
    author:          updated.author,
    authorPrefix:    updated.authorPrefix,
    authorImagePath:    updated.authorImagePath,
    trending:        !!updated.trending,
    date:            updated.date,
  };

  await updateDoc(docRef, payload);

  return true;
}

export const deleteArticle = async (collectionKey, article) => {
  
  const q = query(
    collection(db, collectionKey),
    where("id", "==", article.id),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    throw new Error(`No document found with id = ${article.id}`);
  }
  const articleRef = snap.docs[0].ref;

  await updateDoc(articleRef, { deleted: true });

  const infoRef = doc(db, collectionKey, "info");
  await updateDoc(infoRef, {
    removed_ids: arrayUnion(String(article.id))
  });

  return `Article ${article.id} marked deleted and info.updated`;
};

export const fetchInfo = async (collectionKey) => {
  try {
    const infoRef = doc(db, collectionKey, 'info');
    const snap = await getDoc(infoRef);
    return snap.exists() ? snap.data() : {};
  } catch (e) {
    console.error('Error fetching info doc:', e);
    return {};
  }
};

export const fetchArticleById = async (collectionKey, id) => {
  const q = query(
    collection(db, collectionKey),
    where("id", "==", id),
    where("deleted", "==", false),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
};

export const fetchArticles = async (collectionKey) => {
  const articlesQuery = query(
    collection(db, collectionKey),
    orderBy("dateTimestamp", "asc")
  );

  const snapshot = await getDocs(articlesQuery);
  return snapshot.docs
    .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
    .filter(article => !article.deleted);
};

export async function fetchAllArticles(collectionKey) {
  const col = collection(db, collectionKey);
  const q   = query(
    col,
    where('deleted', '==', false),
    orderBy('dateTimestamp', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(article => typeof article.content === 'string');
}
  
export async function fetchAdminPage(collectionKey, pageSize = 5) {
const col = collection(db, collectionKey);
const q = query(
  col,
  where('deleted','==',false),
  orderBy('dateTimestamp','desc'),
  limit(pageSize)
);
const snap = await getDocs(q);
return {
  docs: snap.docs.map(d=>({ id:d.id, ...d.data() })),
  last: snap.docs[snap.docs.length-1] || null
};
}

export const fetchAdminPageAfter = async (
collectionKey,
categoryName = "all",
lastDoc,
pageSize = 5
) => {
const col = collection(db, collectionKey);
const constraints = [
  where("deleted", "==", false),
  orderBy("dateTimestamp", "desc"),
  limit(pageSize),
  startAfter(lastDoc)
];
if (categoryName !== "all") {
  constraints.unshift(where("category", "==", categoryName));
}
const q = query(col, ...constraints);
const snap = await getDocs(q);
return {
  docs: snap.docs.map(d => ({ id: d.id, ...d.data() })),
  last: snap.docs[snap.docs.length - 1] || null
};
};

export const fetchTrendingArticles = async (collectionKey, num = 5) => {
  const q = query(
    collection(db, collectionKey),
    where("deleted", "==", false),
    where("trending", "==", true),
    orderBy("dateTimestamp", "desc"),
    limit(num)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const fetchLatestArticles = async (collectionKey, num = 4) => {
  const q = query(
    collection(db, collectionKey),
    where("deleted", "==", false),
    orderBy("dateTimestamp", "desc"),
    limit(num)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const fetchArticlesByCategory = async (
  collectionKey,
  category,
  num = 9
) => {
  const q = query(
    collection(db, collectionKey),
    where("category", "==", category),
    where("deleted", "==", false),
    orderBy("dateTimestamp", "desc"),
    limit(num)
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export async function fetchCategoryPage(collectionKey, categoryName, pageSize=15) {
  const constraints = [
    where("deleted","==", false),
    orderBy("dateTimestamp","desc"),
    limit(pageSize)
  ];
  if (categoryName !== "all") {
    constraints.unshift(where("category","==", categoryName));
  }
  const q = query(collection(db, collectionKey), ...constraints);
  const snap = await getDocs(q);
  return {
    docs: snap.docs.map(d=>({ id:d.id, ...d.data() })),
    last: snap.docs[snap.docs.length-1] || null
  };
}

export const fetchCategoryPageAfter = async (
  collectionKey,
  categoryName,
  lastDoc,
  pageSize = 15
) => {
  const col = collection(db, collectionKey);

  const constraints = [
    where("deleted", "==", false),
    orderBy("dateTimestamp", "desc"),
    limit(pageSize),
    startAfter(lastDoc)
  ];

  if (categoryName !== "all") {
    constraints.unshift(where("category", "==", categoryName));
  }

  const q = query(col, ...constraints);
  const snap = await getDocs(q);

  return {
    docs: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    last: snap.docs[snap.docs.length - 1] || null
  };
};

export async function searchArticlesByTitleSingleWord(
  collectionKey,
  rawSubstr,
  num = 50
) {
  const sub = normalize(rawSubstr);
  const q = query(
    collection(db, collectionKey),
    where('deleted', '==', false),
    where('ngrams', 'array-contains', sub),
    limit(num)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export const sendNewsletterAndUpdate = async (collectionKey, article_id, groupIds) => {

  try {

    const article = await fetchArticleById(collectionKey, article_id);
    if (!article) throw new Error("Article not found");

    const strippedContent = article.content.replace(/<[^>]*>?/gm, '');
    const words = strippedContent.split(' ');
    const displayContent = words.slice(0, 50).join(' ')+"...";

    console.log("Starting newsletter process")

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

      console.log("Sending request")

      const data = await response;

      console.log("Request done")

      if (response.ok) {

        console.log('Newsletter sent successfully:', data);

        const col = collection(db, collectionKey);
        const q2 = query(col, where("id", "==", article_id), limit(1));
        const snap2 = await getDocs(q2);
        if (snap2.empty) {
          console.warn("Could not find doc to update mailSent flags");
          return true; 
        }
          
        const docRef = snap2.docs[0].ref;
        
        const patch = {};

        if (groupIds.includes(process.env.REACT_APP_MAILERLITE_API_TEST1_GROUP_ID))
          patch.mailSentTest1 = true;
        if (groupIds.includes(process.env.REACT_APP_MAILERLITE_API_TEST2_GROUP_ID))
          patch.mailSentTest2 = true;
        if (groupIds.includes(process.env.REACT_APP_MAILERLITE_API_GROUP1_ID))
          patch.mailSentGroup1 = true;
        // if (groupIds.includes(process.env.REACT_APP_MAILERLITE_API_GROUP2_ID))
        //   patch.mailSentGroup2 = true;
        // if (groupIds.includes(process.env.REACT_APP_MAILERLITE_API_GROUP3_ID))
        //   patch.mailSentGroup3 = true;
        if (groupIds.includes(process.env.REACT_APP_MAILERLITE_API_GROUP4_ID))
          patch.mailSentGroup4 = true;
        if (groupIds.includes(process.env.REACT_APP_MAILERLITE_API_GROUP5_ID))
          patch.mailSentGroup5 = true;
        if (Object.keys(patch).length > 0) {
          await updateDoc(docRef, patch);
          console.log("mailSent flags updated on doc", docRef.id);
        }

        return true;
              
      } else {

        console.error('Failed to send newsletter:', data);

        return false;

      }

    } catch (error) {
      console.error('Error while sending the newsletter:', error);
      throw error;
    }

  } catch (error) {
    console.error('Error in sendNewsletterAndUpdate:', error);
    throw error;
  }

};
