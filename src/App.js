import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Category from './components/Category';
import Admin from './pages/Admin';
import './styles/global.css';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import ArticleView from './components/ArticleView';
import Search from './components/Search';
import SubscribePopup from './components/SubscribePopup';
import Podcasts from './pages/Podcasts';
import About from './pages/About';
import VideoTV from './pages/VideoTV';
import Radio from './pages/Radio';
import Terms from './pages/Terms';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-G-DPPGVTD3EL');

const Tracking = () => {
  const location = useLocation();
  
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null;
};

const App = () => {


  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 10); // Show popup after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Function to handle scroll disabling
    const handleScroll = () => {
      if (showPopup) {
        // Disable scrolling when popup is shown
        document.body.style.overflow = 'hidden';
      } else {
        // Enable scrolling when popup is hidden
        document.body.style.overflow = 'auto';
      }
    };

    // Attach event listener for scroll
    // window.addEventListener('scroll', handleScroll);

    // Clean up function to remove event listener
    // return () => {
    //   window.removeEventListener('scroll', handleScroll);
    // };
  }, [showPopup]);

  const handleClosePopup = () => {
    setShowPopup(false);
    // Ensure scrolling is re-enabled when popup is closed
    document.body.style.overflow = 'auto';
  };

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
