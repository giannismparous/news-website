import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

import Home from './pages/Home';
import Category from './components/Category';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import Footer from './components/Footer';
import ArticleView from './components/ArticleView';
import Search from './components/Search';
import Podcasts from './pages/Podcasts';
import About from './pages/About';
import VideoTV from './pages/VideoTV';
import Radio from './pages/Radio';
import Terms from './pages/Terms';


import './styles/global.css';

ReactGA.initialize('G-G-DPPGVTD3EL');

const Tracking = () => {
  const location = useLocation();
  
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null;
};

const App = () => {


  // const [showPopup, setShowPopup] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowPopup(true);
  //   }, 10);

  //   return () => clearTimeout(timer);
  // }, []);

  // useEffect(() => {
    
  //   const handleScroll = () => {
  //     if (showPopup) {
  //       document.body.style.overflow = 'hidden';
  //     } else {
  //       document.body.style.overflow = 'auto';
  //     }
  //   };

   
  // }, [showPopup]);

  // const handleClosePopup = () => {
  //   setShowPopup(false);
    
  //   document.body.style.overflow = 'auto';
  // };

  return (
    <div className="App">
      {/* {showPopup && <SubscribePopup onClose={handleClosePopup} />} */}
      <Tracking />
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/category/:categoryName" element={<Category />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/articles/:articleId" element={<ArticleView />} />
        <Route path="/:articleId" element={<ArticleView />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/podcasts" element={<Podcasts/>}/>
        <Route path="/videotv" element={<VideoTV/>}/>
        <Route path="/radio" element={<Radio/>}/>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
