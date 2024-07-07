import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { useMediaQuery } from 'react-responsive'; // Import media query hook
import '../styles/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import Hamburger from 'hamburger-react';

const Navbar = () => {

    const [sidebar, setSidebar] = useState(false);

    const toggleSidebar = () => {
      setSidebar(!sidebar);
      setMenuOpen(!sidebar); // Ensure menuOpen state is synced with sidebar state
  };

    const [menuOpen, setMenuOpen] = useState(false);
    

    const syntaktesBlackImgPath = process.env.PUBLIC_URL +'/syntaktes3.png';
    const syntaktesWhiteImgPath = process.env.PUBLIC_URL +'/syntaktes1-white.png';
    const syntaktesOrangeImgPath = process.env.PUBLIC_URL +'/syntaktes1-orange.png';
    const searchBlackImgPath = process.env.PUBLIC_URL +'/icons/search-black.png';
    const searchWhiteImgPath = process.env.PUBLIC_URL +'/icons/search-white.png';
    const searchOrangeImgPath = process.env.PUBLIC_URL +'/icons/search-orange.png';
    const podcastBlackImgPath = process.env.PUBLIC_URL +'/icons/podcast-black.png';
    const podcastWhiteImgPath = process.env.PUBLIC_URL +'/icons/podcast-white.png';
    const podcastOrangeImgPath = process.env.PUBLIC_URL +'/icons/podcast-orange.png';
    const tvBlackImgPath = process.env.PUBLIC_URL +'/icons/tv-black.png';
    const tvWhiteImgPath = process.env.PUBLIC_URL +'/icons/tv-white.png';
    const tvOrangeImgPath = process.env.PUBLIC_URL +'/icons/tv-orange.png';
    const kedpressImgPath = process.env.PUBLIC_URL +'/icons/ked_press.png';

    const [scrollPosition, setScrollPosition] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [logoIsHovered, setLogoIsHovered] = useState(false);
    const [kedPressIsHovered, setKedPressIsHovered] = useState(false);
    const [podcastIsHovered, setPodcastIsHovered] = useState(false);
    const [tvIsHovered, setTvIsHovered] = useState(false);
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

    const handleMouseEnterKedPress = () => {
      setKedPressIsHovered(true);
    };
    
    const handleMouseLeaveKedPress = () => {
      setKedPressIsHovered(false);
    };
  
    const handleMouseEnterPodcast = () => {
      setPodcastIsHovered(true);
    };
    
    const handleMouseLeavePodcast = () => {
      setPodcastIsHovered(false);
    };

    const handleMouseEnterTv = () => {
      setTvIsHovered(true);
    };
    
    const handleMouseLeaveTv = () => {
      setTvIsHovered(false);
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
  
    const [hamburgerIsHovered, setHamburgerIsHovered] = useState(false);

    const handleMouseEnterHamburger = () => {
      setHamburgerIsHovered(true);
    };

    const handleMouseLeaveHamburger = () => {
      setHamburgerIsHovered(false);
    };

    return (
        <div>
            <nav className="navbar" style={{ backgroundColor: (isHovered || (isMobile && menuOpen)) ? 'rgb(131,131,131)' : scrollPosition === 0 ? 'transparent' : 'rgba(131,131,131,0.9)' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <Hamburger
                label="Show menu"
                rounded
                hideOutline={false}
                direction="left"
                size={100}
                color={
                  hamburgerIsHovered
                    ? '#45a049'
                    : scrollPosition === 0
                    ? 'black'
                    : 'white'
                }
                duration={0.8}
                toggled={menuOpen}
                toggle={toggleSidebar}
                onMouseEnter={handleMouseEnterHamburger}
                onMouseLeave={handleMouseLeaveHamburger}
              />
                <div className="logo-container">
                  <Link to="/" className="logo-container">
                    <img
                      src={
                        logoIsHovered
                          ? syntaktesOrangeImgPath
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
                {/* <div className="podcast-container">
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
                </div> */}
                <ul className='nav-bar-links'>
                  <li><Link to="/category/Πολιτική" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Πολιτική</Link></li>
                  <li><Link to="/category/Απόψεις" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Απόψεις</Link></li>
                  <li><Link to="/category/Απόψεις" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Off the record</Link></li>
                  <li><Link to="/category/Κοινωνία"><img 
                  src={
                    kedpressImgPath
                      ? kedpressImgPath
                      : isHovered
                      ? kedpressImgPath
                      : scrollPosition === 0
                      ? kedpressImgPath
                      : kedpressImgPath
                  }
                  onMouseEnter={handleMouseEnterKedPress}
                  onMouseLeave={handleMouseLeaveKedPress}
                  alt="KedPress"
                  className="ked_press"
                  /></Link></li>
                  <li className='eshea-text'><Link
          to="/category/Απόψεις"
          className={`nav-link-item ${
            scrollPosition === 0 && !isHovered && !isMobile ? 'colored' : 'white'
          } ${kedPressIsHovered ? 'hovered-kedpress' : ''}`}
        >/EΣΗΕΑ</Link></li>
                </ul>
                <div className="nav-bar-vertical">
                  <ul className='nav-bar-links right'>
                    <li><Link to="/podcasts" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}><span onMouseEnter={handleMouseEnterPodcast}
                  onMouseLeave={handleMouseLeavePodcast}>Podcast</span><img 
                  src={
                    podcastIsHovered
                      ? podcastOrangeImgPath
                      : isHovered
                      ? podcastWhiteImgPath
                      : scrollPosition === 0
                      ? podcastBlackImgPath
                      : podcastWhiteImgPath
                  }
                  onMouseEnter={handleMouseEnterPodcast}
                  onMouseLeave={handleMouseLeavePodcast}
                  alt="Search"
                  className="podcast"
                  /></Link></li>
                    <li><Link to="/videotv" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}><span onMouseEnter={handleMouseEnterTv}
                  onMouseLeave={handleMouseLeaveTv}>VideoTV</span><img 
                  src={
                    tvIsHovered
                      ? tvOrangeImgPath
                      : isHovered
                      ? tvWhiteImgPath
                      : scrollPosition === 0
                      ? tvBlackImgPath
                      : tvWhiteImgPath
                  }
                  onMouseEnter={handleMouseEnterTv}
                  onMouseLeave={handleMouseLeaveTv}
                  alt="Search"
                  className="tv"
                  /></Link></li>
                  </ul>
                  <div className={`search-text nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}><span className='search-span' onClick={toggleSearch} onMouseEnter={handleMouseEnterSearch}
                  onMouseLeave={handleMouseLeaveSearch}>Αναζήτηση</span><img 
                  src={
                    searchIsHovered
                      ? searchOrangeImgPath
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
                  /></div>
                </div>
            </nav>
            <div className={sidebar ? 'sidebar active' : 'sidebar'}>
              <ul>
                <li><Link to="/category/Πολιτική" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Πολιτική</Link></li>
                <li><Link to="/category/Οικονομία" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Απόψεις</Link></li>
                <li><Link to="/category/Κοινωνία" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Εκτός Συνόρων</Link></li>
                <li><Link to="/category/Media" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Αγορά/ Καταναλωτές</Link></li>
                <li><Link to="/category/Πολιτισμός" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Plus/ Life</Link></li>
                <li><Link to="/category/Διεθνή" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Art</Link></li>
                <li><Link to="/category/Πολιτική" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Pet</Link></li>
                <li><Link to="/category/podcasts" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Podcast</Link></li>
                <li><Link to="/category/Κοινωνία" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Kedpress/ ΕΣΗΕΑ</Link></li>
                <li><Link to="/category/Media" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Υγεία/ Συντάξεις</Link></li>
                <li><Link to="/category/Πολιτισμός" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Εργασία</Link></li>
                <li><Link to="/category/Διεθνή" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Off the record</Link></li>
                <li><Link to="/category/Πολιτική" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Δικαστικά</Link></li>
                <li>
                  <div className='search-list-item'>
                    <span >Αναζήτηση</span>
                    <img 
                  src={
                    searchIsHovered
                      ? searchOrangeImgPath
                      : isHovered
                      ? searchWhiteImgPath
                      : scrollPosition === 0
                      ? searchWhiteImgPath
                      : searchWhiteImgPath
                  }
                  onMouseEnter={handleMouseEnterSearch}
                  onMouseLeave={handleMouseLeaveSearch}
                  alt="Search"
                  className="search"
                  onClick={toggleSearch}
                  />
                </div>
              </li>
                <li><Link to="/contact" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Επικοινωνία</Link> </li>
                <li> <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>
                    <FontAwesomeIcon icon={faFacebookF} />
                </a></li>
              </ul>
            </div>
            {sidebar && <div className="overlay" onClick={toggleSidebar}></div>}
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
        </div>
    );
};

export default Navbar;
