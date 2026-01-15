import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ClockLoader } from 'react-spinners';
import ReactQuill, { Quill } from 'react-quill';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import { addArticle, editArticle, fetchArticleById, storage } from '../firebase/firebaseConfig';

import CustomClipboard from './CustomClipboard';

import '../styles/ArticleEditor.css';

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
  const [mailSentTest1, setMailSentTest1] = useState();
  const [mailSentTest2, setMailSentTest2] = useState();
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageVerticalPositionInTrending, setImageVerticalPositionInTrending] = useState('50%');

  const quillRef = useRef(null);

  const handleImageVerticalPositionInTrendingChange = (event) => {
    const value = event.target.value;
    setImageVerticalPositionInTrending(value);
  };


  useEffect(() => {

    window.scrollTo(0, 0);
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
          setMailSentTest1(fetchedArticle.mailSentTest1 || false);
          setMailSentTest2(fetchedArticle.mailSentTest2 || false);
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
        setMailSentTest1(false);
        setMailSentTest2(false);
        setImageVerticalPositionInTrending('50%');
        setTrending(false);
      }
    };

    setUploadOnFacebook(false);
    fetchArticle();
  }, [article]);

  const generateRandomString = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomString;
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const fileName = generateRandomString();
  
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          if (img.width < 200 || img.height < 200) {
            alert('Παρακαλώ επιλέξτε εικόνα με διαστάσεις τουλάχιστον 200×200 px.');
            return;
          }

          const MAX_WIDTH = 800;
          const scale = img.width > MAX_WIDTH ? (MAX_WIDTH / img.width) : 1;

          const canvas = document.createElement('canvas');
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            const newFile = new File([blob], fileName + '.jpeg', { type: 'image/jpeg' });
            setImage(newFile);
            const imageUrl = URL.createObjectURL(newFile);
            setImagePath(imageUrl);
          }, 'image/jpeg', 0.8);
        };
      };
      reader.readAsDataURL(file);
    } else {
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePath(imageUrl);
    }
  };
  
  const handleAuthorImageUpload = (e) => {
    const file = e.target.files[0];
    const fileName = generateRandomString();
  
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {

          const MAX_WIDTH = 400;
          const scale = img.width > MAX_WIDTH ? (MAX_WIDTH / img.width) : 1;

          const canvas = document.createElement('canvas');
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            const newFile = new File([blob], fileName + '.jpeg', { type: 'image/jpeg' });
            setAuthorImage(newFile); 
          }, 'image/jpeg', 0.8);
        };

      };
      reader.readAsDataURL(file);
    } else {
      setAuthorImage(file);
    }
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
      const videoId = url.split('v=')[1].split('&')[0];
      const iframeHtml = `<iframe width="1200px" height="675px" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(range.index, iframeHtml);
      
      console.log(quill.root.innerHTML);
    }
  };

  const handleQuillXPostEmbed = () => {
    const url = prompt('Enter Twitter post URL');
    if (url) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      quill.insertEmbed(range.index, 'twitter', url);

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
        mailSentTest1,
        mailSentTest2,
        caption,
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

        const articleId = await addArticle('articles', newArticle);

        // Warm up the cache for the new article
        if (articleId) {
          fetch(`https://syntaktes.gr/articles/${articleId}`) //warm up the cache
            .catch(() => {});
        }

        if (uploadOnFacebook) {
          await postOnFacebook(newArticle, articleId);
        }

        setLoading(false);
        alert('Επιτυχής δημιουργία!');
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

        fetch(`https://syntaktes.gr/articles/${newArticle.id}`) //warm up the cache
          .catch(() => {});

        if (uploadOnFacebook) {
          await postOnFacebook(newArticle);
        }

        setLoading(false);
        alert('Επιτυχής τροποποίηση!');
        onArticleAdded();
      }
    } catch (error) {
      console.error('Error adding article:', error);
      setLoading(false);
      alert('Σφάλμα!');
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
        ['link', 'image', 'video', 'x-post'], 
        ['clean']
      ],
      handlers: {
        image: handleQuillImageUpload,
        video: handleQuillVideoEmbed,
        'x-post': handleQuillXPostEmbed 
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
          <option value="Οικονομία">Οικονομία</option>
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
          <option value="Test">Test</option>
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
                        justifyContent: 'center', 
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
                            justifyContent: 'center'
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
        </div>
        <p>Αναγνωριστικό εκδότη: {uid}</p>
        {!article && <button type="submit">Δημιουργία</button>}
        {article && <button type="submit">Επεξεργασία </button>}
      </form>
    </div>
  );
};

export default ArticleEditor;
