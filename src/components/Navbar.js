import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { useMediaQuery } from 'react-responsive'; // Import media query hook
import '../styles/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

const syntaktesBlackImgPath = process.env.PUBLIC_URL +'/syntaktes.png';
const syntaktesWhiteImgPath = process.env.PUBLIC_URL +'/syntaktes-white.png';
const syntaktesGreenImgPath = process.env.PUBLIC_URL +'/syntaktes-green.png';
const searchBlackImgPath = process.env.PUBLIC_URL +'/icons/search-black.png';
const searchWhiteImgPath = process.env.PUBLIC_URL +'/icons/search-white.png';
const searchGreenImgPath = process.env.PUBLIC_URL +'/icons/search-green.png';
const podcastBlackImgPath = process.env.PUBLIC_URL +'/icons/podcast-black.png';
const podcastWhiteImgPath = process.env.PUBLIC_URL +'/icons/podcast-white.png';
const podcastGreenImgPath = process.env.PUBLIC_URL +'/icons/podcast-green.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [logoIsHovered, setLogoIsHovered] = useState(false);
  const [podcastIsHovered, setPodcastIsHovered] = useState(false);
  const [searchIsHovered, setSearchIsHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();


  const isMobile = useMediaQuery({ maxWidth: 768 }); // Check if screen width is <= 768px
  const isMobile2 = useMediaQuery({ maxWidth: 450 }); // Check if screen width is <= 768px

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseEnterLogo = () => {
    setLogoIsHovered(true);
  };
  
  const handleMouseLeaveLogo = () => {
    setLogoIsHovered(false);
  };

  const handleMouseEnterPodcast = () => {
    setPodcastIsHovered(true);
  };
  
  const handleMouseLeavePodcast = () => {
    setPodcastIsHovered(false);
  };

  const handleMouseEnterSearch = () => {
    setSearchIsHovered(true);
  };
  
  const handleMouseLeaveSearch = () => {
    setSearchIsHovered(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="navbar" style={{ backgroundColor: (isHovered || (isMobile && menuOpen)) ? 'rgb(51,51,51)' : scrollPosition === 0 ? 'transparent' : 'rgba(51,51,51,0.9)' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="logo-container">
        <Link to="/" className="logo-container" onClick={toggleMenu}>
          <img
            src={
              logoIsHovered
                ? syntaktesGreenImgPath
                : isHovered
                ? syntaktesWhiteImgPath
                : scrollPosition === 0
                ? syntaktesBlackImgPath
                : syntaktesWhiteImgPath
            }
            onMouseEnter={handleMouseEnterLogo}
            onMouseLeave={handleMouseLeaveLogo}
            alt="Company Logo"
            className="logo"
          />
        </Link>
      </div>
      <div className="podcast-container">
        <Link to="/podcasts" className="podcast-container" onClick={toggleMenu}>
          <img
            src={
              podcastIsHovered
                ? podcastGreenImgPath
                : isHovered
                ? podcastWhiteImgPath
                : scrollPosition === 0
                ? podcastBlackImgPath
                : podcastWhiteImgPath
            }
            onMouseEnter={handleMouseEnterPodcast}
            onMouseLeave={handleMouseLeavePodcast}
            alt="Podcast Icon"
            className="podcast"
          />
        </Link>
      </div>
      <ul className={`nav-links ${menuOpen ? 'nav-links-activated' : 'nav-links-deactivated'}`}>
        <div className='nav-links-text'>
          {/* <li><Link to="/" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Αρχική</Link></li> */}
          <li><Link to="/category/Πολιτική" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Πολιτική</Link></li>
          <li><Link to="/category/Οικονομία" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Οικονομία</Link></li>
          <li><Link to="/category/Κοινωνία" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Κοινωνία</Link></li>
          <li><Link to="/category/Media" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Media</Link></li>
          <li><Link to="/category/Πολιτισμός" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Πολιτισμός</Link></li>
          <li><Link to="/category/Διεθνή" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Διεθνή</Link></li>
          <li><Link to="/category/Απόψεις" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Απόψεις</Link></li>
          <img 
          src={
            searchIsHovered
              ? searchGreenImgPath
              : isHovered
              ? searchWhiteImgPath
              : scrollPosition === 0
              ? searchBlackImgPath
              : searchWhiteImgPath
          }
          onMouseEnter={handleMouseEnterSearch}
          onMouseLeave={handleMouseLeaveSearch}
          alt="Search"
          className="search"
          onClick={toggleSearch}
        />
        </div>
      </ul>
      <div className="social-media-list">
        <Link to="/contact" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Επικοινωνία</Link> 
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
      </div>
      {isSearchOpen && (
        <div className="search-overlay" onClick={handleBackgroundClick}>
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
            />
            <button type="submit" className="search-submit">Search</button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
