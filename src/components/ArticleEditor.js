import React, { useEffect, useState, useRef, useMemo } from 'react';
import { addNewArticle, db, editArticle, fetchArticleById, storage } from '../firebase/firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/ArticleEditor.css';

const ArticleEditor = ({ article, onArticleAdded }) => {
  const [id, setId] = useState();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [uploadOnFacebook, setUploadOnFacebook] = useState(false);

  const quillRef = useRef(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (article) {
        const fetchedArticle = await fetchArticleById('articles', article.id);
        if (fetchedArticle) {
          setId(fetchedArticle.id);
          setTitle(fetchedArticle.title);
          setContent(fetchedArticle.content);
          setCategory(fetchedArticle.category);
          setAuthor(fetchedArticle.author);
          setDate(fetchedArticle.date);
          setImagePath(fetchedArticle.imagePath);
        }
      } else {
        setId(null);
        setTitle('');
        setContent('');
        setCategory('');
        setAuthor('');
        setDate('');
        setImagePath('');
      }
    };

    fetchArticle();
  }, [article]);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleQuillImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const imageRef = ref(storage, `article_images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytesResumable(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const quill = quillRef.current.getEditor(); // Use Quill's API to get the editor instance
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', downloadURL);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!article) {
        let imagePath = '';

        if (image) {
          const imageRef = ref(storage, `article_images/${Date.now()}_${image.name}`);
          const snapshot = await uploadBytesResumable(imageRef, image);
          imagePath = await getDownloadURL(snapshot.ref);
        }

        const newArticle = {
          title,
          content,
          category,
          author,
          imagePath,
        };

        const docRef = await addNewArticle('articles', newArticle);

        if (uploadOnFacebook) {
          await postOnFacebook(newArticle, docRef.id);
        }

        alert('Article added successfully');
        onArticleAdded();
      } else {
        const updatedArticle = {
          id,
          title,
          content,
          category,
          author,
          date,
          imagePath,
        };

        await editArticle('articles', updatedArticle);

        if (uploadOnFacebook) {
          await postOnFacebook(updatedArticle);
        }

        alert('Article edited successfully');
        onArticleAdded();
      }
    } catch (error) {
      console.error('Error adding article:', error);
      alert('Error adding article');
    }
  };

  const postOnFacebook = async (article, articleId) => {
    // Implement your logic to post on Facebook here
    console.log('Posting on Facebook:', article, articleId);
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline', 'blockquote'],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: handleQuillImageUpload
      }
    }
  }), []);

  const formats = [
    'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'blockquote',
    'align', 'link', 'image', 'video'
  ];

  return (
    <div className="editor-container">
      <h1>{article ? 'Edit Article' : 'Add New Article'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          required
        />
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="Write your article content here..."
        />
        <div className='form-last-section'>
          {!article && (
            <div>
              <span>Ανεβάστε thumbnail: </span>
              <input type="file" onChange={handleImageUpload} />
            </div>
          )}
          <label>
            <input
              type="checkbox"
              checked={uploadOnFacebook}
              onChange={(e) => setUploadOnFacebook(e.target.checked)}
            />
            Δημοσίευση στο Facebook
          </label>
        </div>
        {!article && <button type="submit">Δημιουργία</button>}
        {article && <button type="submit">Επεξεργασία </button>}
      </form>
    </div>
  );
};

export default ArticleEditor;
