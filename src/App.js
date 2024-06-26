import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Category from './components/Category';
import Admin from './pages/Admin';
import './styles/global.css'; // Import your CSS file
import Contact from './pages/Contact';
import Footer from './components/Footer';

const App = () => {
  return (
    <>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      <Footer />
    </>
  );
};

export default App;
