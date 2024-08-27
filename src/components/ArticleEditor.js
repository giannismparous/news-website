import React, { useEffect, useState, useRef, useMemo } from 'react';
import { addNewArticle, editArticle, fetchArticleById, storage } from '../firebase/firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/ArticleEditor.css';
import CustomClipboard from './CustomClipboard';
import { ClockLoader } from 'react-spinners';
const BlockEmbed = Quill.import('blots/block/embed');

class TwitterBlot extends BlockEmbed {
  static create(value) {
    const node = super.create(value);
    node.setAttribute('contenteditable', false);
    const innerHtml = `
      <blockquote class="twitter-tweet">
        <a href="${value}"></a>
      </blockquote>
      <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    `;
    node.innerHTML = innerHtml;
    return node;
  }

  static value(node) {
    return node.querySelector('a').getAttribute('href');
  }
}

TwitterBlot.blotName = 'twitter';
TwitterBlot.className = 'ql-twitter';
TwitterBlot.tagName = 'div';

Quill.register(TwitterBlot);

Quill.register('modules/clipboard', CustomClipboard);

const ArticleEditor = ({ article, onArticleAdded, uid }) => {
  const [id, setId] = useState();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [authorImage, setAuthorImage] = useState(null);
  const [authorImagePath, setAuthorImagePath] = useState('');
  const [uploadOnFacebook, setUploadOnFacebook] = useState(false);
  const [trending, setTrending] = useState(false);
  const [author, setAuthor] = useState('');
  const [authorPrefix, setAuthorPrefix] = useState('Του');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageVerticalPositionInTrending, setImageVerticalPositionInTrending] = useState('50%');

  const quillRef = useRef(null);

  const handleImageVerticalPositionInTrendingChange = (event) => {
    const value = event.target.value;
    setImageVerticalPositionInTrending(value);
  };


  useEffect(() => {
    const fetchArticle = async () => {
      if (article) {
        const fetchedArticle = await fetchArticleById('articles', article.id);
        if (fetchedArticle) {
          setId(fetchedArticle.id);
          setTitle(fetchedArticle.title);
          setContent(fetchedArticle.content);
          setCategory(fetchedArticle.category);
          setDate(fetchedArticle.date);
          setImagePath(fetchedArticle.imagePath);
          setAuthor(fetchedArticle.author || '');
          setAuthorPrefix(fetchedArticle.authorPrefix || 'Του');
          setAuthorImagePath(fetchedArticle.authorImagePath || '');
          setCaption(fetchedArticle.caption || '');
          setImageVerticalPositionInTrending(fetchedArticle.imageVerticalPositionInTrending || '50%');
          setTrending(fetchedArticle.trending || false);
        }
      } else {
        setId(null);
        setTitle('');
        setContent('');
        setCategory('');
        setDate('');
        setImagePath('');
        setAuthor('');
        setAuthorPrefix('Του');
        setAuthorImagePath('');
        setCaption('');
        setImageVerticalPositionInTrending('50%');
        setTrending(false);
      }
    };

    fetchArticle();
  }, [article]);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
    const imageUrl = URL.createObjectURL(e.target.files[0]);
    setImagePath(imageUrl);
  };

  const handleAuthorImageUpload = (e) => {
    setAuthorImage(e.target.files[0]);
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

      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', downloadURL);
    };
  };

  const handleQuillVideoEmbed = () => {
    const url = prompt('Enter YouTube URL');
    if (url) {
      const videoId = url.split('v=')[1].split('&')[0]; // Extract YouTube video ID
      const iframeHtml = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(range.index, iframeHtml);
      // Print the current content of the Quill editor
      console.log(quill.root.innerHTML);
    }
  };

  const handleQuillXPostEmbed = () => {
    const url = prompt('Enter Twitter post URL');
    if (url) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      quill.insertEmbed(range.index, 'twitter', url);

      // Print the current content of the Quill editor
      console.log(quill.root.innerHTML);
    }
  };

  const formatCategory = (category) => {
    return category.replace(/\s+/g, '_').replace(/\//g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formattedCategory = formatCategory(category);

      let newArticle = {
        title,
        content,
        category: formattedCategory,
        uid,
        imagePath,
        trending,
        author,
        authorPrefix,
        authorImagePath,
        imageVerticalPositionInTrending,
        caption
      };

      if (!article) {
        if (image) {
          const imageRef = ref(storage, `article_images/${Date.now()}_${image.name}`);
          const snapshot = await uploadBytesResumable(imageRef, image);
          newArticle.imagePath = await getDownloadURL(snapshot.ref);
        }

        if (authorImage) {
          const imageRef = ref(storage, `article_author_images/${Date.now()}_${authorImage.name}`);
          const snapshot = await uploadBytesResumable(imageRef, authorImage);
          newArticle.authorImagePath = await getDownloadURL(snapshot.ref);
        }

        const docRef = await addNewArticle('articles', newArticle);

        if (uploadOnFacebook) {
          await postOnFacebook(newArticle, docRef.id);
        }

        setLoading(false);
        alert('Article added successfully');
        onArticleAdded();
      } else {
        if (image) {
          const imageRef = ref(storage, `article_images/${Date.now()}_${image.name}`);
          const snapshot = await uploadBytesResumable(imageRef, image);
          newArticle.imagePath = await getDownloadURL(snapshot.ref);
        }

        if (authorImage) {
          const imageRef = ref(storage, `article_author_images/${Date.now()}_${authorImage.name}`);
          const snapshot = await uploadBytesResumable(imageRef, authorImage);
          newArticle.authorImagePath = await getDownloadURL(snapshot.ref);
        }

        newArticle = {
          ...newArticle,
          id,
          date,
        };

        await editArticle('articles', newArticle);

        if (uploadOnFacebook) {
          await postOnFacebook(newArticle);
        }

        setLoading(false);
        alert('Article edited successfully');
        onArticleAdded();
      }
    } catch (error) {
      console.error('Error adding article:', error);
      setLoading(false);
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
        ['link', 'image', 'video', 'x-post'], // Add the x-post button here
        ['clean']
      ],
      handlers: {
        image: handleQuillImageUpload,
        video: handleQuillVideoEmbed,
        'x-post': handleQuillXPostEmbed // Add custom handler for X post
      }
    },
    clipboard: {
      matchVisual: false,
    },
  }), []);

  const formats = [
    'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'blockquote',
    'align', 'link', 'image', 'video', 'twitter'
  ];

  return (
    <div className="editor-container">
      {loading &&
        <div className='article-editor-loader'>
          <ClockLoader color="#e29403d3" loading={loading} size={150} />
        </div>
        }
      <h1>{article ? 'Edit Article' : 'Add New Article'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Τίτλος"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Διαλέξτε κατηγορία</option>
          <option value="Πολιτική">Πολιτική</option>
          <option value="Απόψεις">Απόψεις</option>
          <option value="Παρασκήνια">Παρασκήνια</option>
          <option value="Kedpress/ ΕΣΗΕΑ">Kedpress/ ΕΣΗΕΑ</option>
          <option value="Εκτός Συνόρων">Εκτός Συνόρων</option>
          <option value="Αγορά/ Καταναλωτές">Αγορά/ Καταναλωτές</option>
          <option value="Plus/ Life">Plus/ Life</option>
          <option value="Σπορ">Σπορ</option>
          <option value="Art">Art</option>
          <option value="Pet">Pet</option>
          <option value="Υγεία/ Συντάξεις">Υγεία/ Συντάξεις</option>
          <option value="Εργασία">Εργασία</option>
          <option value="Δικαστικά">Δικαστικά</option>
        </select>
        <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Λεζάντα (προαιρετικό)"
          />
        <div className="author-section">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Όνομα συγγραφέα/ συντάκτη"
          />
          <div className="prefix-section">
            <label>
              <input
                type="radio"
                value="Του"
                checked={authorPrefix === 'Του'}
                onChange={(e) => setAuthorPrefix(e.target.value)}
              />
              Του
            </label>
            <label>
              <input
                type="radio"
                value="Της"
                checked={authorPrefix === 'Της'}
                onChange={(e) => setAuthorPrefix(e.target.value)}
              />
              Της
            </label>
          </div>
          {category==="Απόψεις" && 
          <div>
          <span>Ανεβάστε φωτογραφία συντάκτη: </span>
          <input type="file" onChange={handleAuthorImageUpload} />
          {authorImagePath && <img src={authorImagePath} alt="Author" />}
        </div>}
        </div>
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="Γράψτε κείμενο εδώ..."
        />
        <div className='form-last-section'>
          <div>
          <fieldset className='image-fieldset'>
                    <legend>Eικόνα:</legend>
                    <label>
                      <input
                        type="checkbox"
                        checked={trending}
                        onChange={(e) => setTrending(e.target.checked)}
                      />
                      Trending
                    </label>
                    {trending &&
                      <div style ={{   
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', // Centers horizontally
                        paddingLeft: '200px',
                        paddingRight: '200px'
                      }}>
                        Κατακόρυφη τοποθέτηση εικόνας (trending):
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={parseInt(imageVerticalPositionInTrending)} 
                            onChange={handleImageVerticalPositionInTrendingChange} 
                            className="slider"
                            required 
                        />
                        {imagePath && (
                          <div style={{ 
                            width: '400px', 
                            height: '133px', 
                            overflow: 'hidden', 
                            display: 'flex', 
                            justifyContent: 'center' // Centers horizontally
                          }}>
                            <img
                              src={imagePath}
                              alt="Thumbnail"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: `100% ${imageVerticalPositionInTrending}%`,
                              }}
                            />
                          </div>
                        )}
                    </div>}
                  <div>
                    <span>Ανεβάστε φωτογραφία δημοσιεύματος: </span>
                    <input type="file" onChange={handleImageUpload} />
                    {imagePath && <img src={imagePath} alt="Thumbnail" style={{ width: '400px', height: '100%', }}/>}
                  </div>
                </fieldset>
          </div>
          {/* <label>
            <input
              type="checkbox"
              checked={uploadOnFacebook}
              onChange={(e) => setUploadOnFacebook(e.target.checked)}
            />
            Δημοσίευση στο Facebook
          </label> */}
        </div>
        <p>Αναγνωριστικό εκδότη: {uid}</p> {/* Display the UID */}
        {!article && <button type="submit">Δημιουργία</button>}
        {article && <button type="submit">Επεξεργασία </button>}
      </form>
    </div>
  );
};

export default ArticleEditor;
