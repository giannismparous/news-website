import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Category from './components/Category';
import Admin from './pages/Admin';
import './styles/global.css'; // Import your CSS file
import Contact from './pages/Contact';
import Footer from './components/Footer';
import ArticleView from './components/ArticleView';
import Search from './components/Search';
import SubscribePopup from './components/SubscribePopup';
import Podcasts from './pages/Podcasts';

const App = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000); // Show popup after 5 seconds

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
    window.addEventListener('scroll', handleScroll);

    // Clean up function to remove event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showPopup]);

  const handleClosePopup = () => {
    setShowPopup(false);
    // Ensure scrolling is re-enabled when popup is closed
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="App">
      {showPopup && <SubscribePopup onClose={handleClosePopup} />}
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/category/:categoryName" element={<Category />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/articles/:articleId" element={<ArticleView />} />
        <Route path="/:articleId" element={<ArticleView />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/podcasts" element={<Podcasts/>}/>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
