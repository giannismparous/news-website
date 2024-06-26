// import React, { useState } from 'react';
// import axios from 'axios';
// import '../styles/ArticleEditor.css';

// const ArticleEditor = ({ onArticleAdded }) => {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [category, setCategory] = useState('');
//   const [image, setImage] = useState(null);

//   const handleImageUpload = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       let imagePath = '';

//       if (image) {
//         const formData = new FormData();
//         formData.append('image', image);
//         console.log("τεστ2");
//         console.log(image);
//         console.log("τεστ1");
//         const response = await axios.post('http://localhost:5000/upload', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         console.log("τεστ3");
//         console.log(image);
//         imagePath = response.data.path;
//         console.log(image);
//       }

//       const newArticle = { title, content, category, imagePath };
//       await axios.post('http://localhost:5000/articles', newArticle);
//       alert('Article added successfully');
//       onArticleAdded();
//     } catch (error) {
//       console.error('Error adding article:', error);
//       alert('Error adding article');
//     }
//   };

//   return (
//     <div className="editor-container">
//       <h1>Add New Article</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Title"
//           required
//         />
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="Content"
//           required
//         />
//         <input
//           type="text"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           placeholder="Category"
//           required
//         />
//         <input type="file" onChange={handleImageUpload} />
//         <button type="submit">Add Article</button>
//       </form>
//     </div>
//   );
// };

// export default ArticleEditor;
// components/ArticleEditor.js

import React, { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore modules
import '../styles/ArticleEditor.css';
import { addNewArticle, db, editArticle, fetchArticleById, storage } from '../firebase/firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const ArticleEditor = ({ article, onArticleAdded }) => {
    const [id, setId] = useState();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [imagePath, setImagePath] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            if (article) {
                const fetchedArticle = await fetchArticleById("articles",article.id);
                if (fetchedArticle) {
                    setId(fetchedArticle.id);
                    setTitle(fetchedArticle.title);
                    setContent(fetchedArticle.content);
                    setCategory(fetchedArticle.category);
                    setImagePath(fetchedArticle.imagePath);
                }
            } else {
                setId();
                setTitle('');
                setContent('');
                setCategory('');
                setImagePath('');
            }
        };

        fetchArticle();
        
    }, [article]);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        if (!article){
            let imagePath = '';

            if (image) {
              
              console.log("Uploading image...")
              const imageRef = ref(storage, `article_images/${Date.now()}_${image.name}`);
              const snapshot = await uploadBytesResumable(imageRef, image);
              imagePath = await getDownloadURL(snapshot.ref);
              console.log("Image uploaded:")
              console.log(imagePath)
            }
      
            await addNewArticle("articles",title,content,category,imagePath);
      
            alert('Article added successfully');
            onArticleAdded();
        }
        else {
      
            article= {
                id: id,
                title: title,
                content: content,
                category: category,
                imagePath: imagePath
            }

            await editArticle("articles",article);
      
            alert('Article edited successfully');
            onArticleAdded();
        }
      
    } catch (error) {
      console.error('Error adding article:', error);
      alert('Error adding article');
    }
  };

  return (
    <div className="editor-container">
      <h1>Add New Article</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
        />
        {!article && <input type="file" onChange={handleImageUpload} />}
        {!article && <button type="submit">Add Article</button>}
        {article && <button type="submit">Edit Article</button>}
      </form>
    </div>
  );
};

export default ArticleEditor;
