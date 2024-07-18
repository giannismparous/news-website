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
    

    const syntaktesBlackImgPath = process.env.PUBLIC_URL +'/syntaktes-black.png';
    const syntaktesWhiteImgPath = process.env.PUBLIC_URL +'/syntaktes-black.png';
    const syntaktesOrangeImgPath = process.env.PUBLIC_URL +'/syntaktes-orange.png';
    const kedpressBlackImgPath = process.env.PUBLIC_URL +'/icons/ked_press.png';
    const kedpressOrangeImgPath = process.env.PUBLIC_URL +'/icons/ked_press-orange.png';
    const searchBlackImgPath = process.env.PUBLIC_URL +'/icons/search-black.png';
    const searchWhiteImgPath = process.env.PUBLIC_URL +'/icons/search-white.png';
    const searchOrangeImgPath = process.env.PUBLIC_URL +'/icons/search-orange.png';
    const podcastBlackImgPath = process.env.PUBLIC_URL +'/icons/podcast-black.png';
    const podcastWhiteImgPath = process.env.PUBLIC_URL +'/icons/podcast-white.png';
    const podcastOrangeImgPath = process.env.PUBLIC_URL +'/icons/podcast-orange.png';
    const tvBlackImgPath = process.env.PUBLIC_URL +'/icons/tv-black.png';
    const tvWhiteImgPath = process.env.PUBLIC_URL +'/icons/tv-white.png';
    const tvOrangeImgPath = process.env.PUBLIC_URL +'/icons/tv-orange.png';
    const radioBlackImgPath = process.env.PUBLIC_URL +'/icons/radio-black.png';
    const radioWhiteImgPath = process.env.PUBLIC_URL +'/icons/radio-white.png';
    const radioOrangeImgPath = process.env.PUBLIC_URL +'/icons/radio-orange.png';

    const [scrollPosition, setScrollPosition] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [logoIsHovered, setLogoIsHovered] = useState(false);
    const [kedPressIsHovered, setKedPressIsHovered] = useState(false);
    const [podcastIsHovered, setPodcastIsHovered] = useState(false);
    const [tvIsHovered, setTvIsHovered] = useState(false);
    const [radioIsHovered, setRadioIsHovered] = useState(false);
    const [searchIsHovered, setSearchIsHovered] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();


    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isMobile2 = useMediaQuery({ maxWidth: 980 });

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

    const handleMouseEnterRadio = () => {
      setRadioIsHovered(true);
    };
    
    const handleMouseLeaveRadio = () => {
      setRadioIsHovered(false);
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
                size={isMobile2 ? 30 : 100}
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
                <div className="logo-container" 
                onMouseEnter={handleMouseEnterLogo}
                onMouseLeave={handleMouseLeaveLogo}>
                  <Link to="/">
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
                {!isMobile && <ul className='nav-bar-links'>
                  <li><Link to="/category/Πολιτική" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Πολιτική</Link></li>
                  <li><Link to="/category/Απόψεις" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Απόψεις</Link></li>
                  <li><Link to="/category/Παρασκηνια" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Παρασκήνια</Link></li>
                  <li><Link to="/category/Kedpress_ΕΣΗΕΑ" onMouseEnter={handleMouseEnterKedPress}
                  onMouseLeave={handleMouseLeaveKedPress}><img 
                  src={
                    kedPressIsHovered
                      ? kedpressOrangeImgPath
                      : isHovered
                      ? kedpressBlackImgPath
                      : scrollPosition === 0
                      ? kedpressBlackImgPath
                      : kedpressBlackImgPath
                  }
                  alt="KedPress"
                  className="ked_press"
                  /></Link></li>
                  <li className='eshea-text'><Link
          to="/category/Απόψεις"
          className={`nav-link-item ${
            scrollPosition === 0 && !isHovered && !isMobile ? 'colored' : 'white'
          } ${kedPressIsHovered ? 'hovered-kedpress' : ''}`}
          onMouseEnter={handleMouseEnterKedPress}
                  onMouseLeave={handleMouseLeaveKedPress}
        >/EΣΗΕΑ</Link></li>
                </ul>}
                {!isMobile2 && !isMobile && <div className="nav-bar-vertical">
                  <ul className='nav-bar-links right'>
                    <li><Link to="/podcasts" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`} onMouseEnter={handleMouseEnterPodcast}
                  onMouseLeave={handleMouseLeavePodcast}><span >Podcast</span><img 
                  src={
                    podcastIsHovered
                      ? podcastOrangeImgPath
                      : isHovered
                      ? podcastWhiteImgPath
                      : scrollPosition === 0
                      ? podcastBlackImgPath
                      : podcastWhiteImgPath
                  }
                  alt="Search"
                  className="podcast"
                  /></Link></li>
                    <li><Link to="/videotv" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`} onMouseEnter={handleMouseEnterTv}
                  onMouseLeave={handleMouseLeaveTv}><span>VideoTV</span><img 
                  src={
                    tvIsHovered
                      ? tvOrangeImgPath
                      : isHovered
                      ? tvWhiteImgPath
                      : scrollPosition === 0
                      ? tvBlackImgPath
                      : tvWhiteImgPath
                  }
                  
                  alt="Search"
                  className="tv"
                  /></Link></li>
                  </ul>
                  <div >
                    <Link to="/radio" className={`search-text nav-link-item no-text-decoration ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`} onMouseEnter={handleMouseEnterRadio}
                  onMouseLeave={handleMouseLeaveRadio}>
                    <span className='search-span' >Radio</span><img 
                  src={
                    radioIsHovered
                      ? radioOrangeImgPath
                      : isHovered
                      ? radioWhiteImgPath
                      : scrollPosition === 0
                      ? radioBlackImgPath
                      : radioWhiteImgPath
                  }
                  alt="Radio"
                  className="radio"
                  />
                  </Link>
                  </div>
                </div>}
            </nav>
            <div className={sidebar ? 'sidebar active' : 'sidebar'}>
              <ul>
              <li className='side-bar-item' onMouseEnter={handleMouseEnterSearch}
                  onMouseLeave={handleMouseLeaveSearch}>
                  <div className='search-list-item' 
                  onClick={toggleSearch}>
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
                  alt="Search"
                  className="search"
                  onClick={toggleSearch}
                  />
                </div>
              </li>
                <li><Link to="/category/Πολιτική" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Πολιτική</Link></li>
                <li><Link to="/category/Απόψεις" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Απόψεις</Link></li>
                <li><Link to="/category/Παρασκήνια" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Παρασκήνια</Link></li>
                <li><Link to="/category/Kedpress_ΕΣΗΕΑ" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Kedpress/ ΕΣΗΕΑ</Link></li>
                <li><Link to="/category/Εκτός_Συνόρων" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Εκτός Συνόρων</Link></li>
                <li><Link to="/category/Αγορά_Καταναλωτές" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Αγορά/ Καταναλωτές</Link></li>
                <li><Link to="/category/Plus_Life" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Plus/ Life</Link></li>
                <li><Link to="/category/Σπορ" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Σπορ</Link></li>
                <li><Link to="/category/Art" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Art</Link></li>
                <li><Link to="/category/Pet" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Pet</Link></li>
                <li><Link to="/category/Podcast" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Podcast</Link></li>
                <li><Link to="/category/Υγεία_Συντάξεις" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Υγεία/ Συντάξεις</Link></li>
                <li><Link to="/category/Εργασία" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Εργασία</Link></li>
                <li><Link to="/category/Δικαστικά" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Δικαστικά</Link></li>
                <li onMouseEnter={handleMouseEnterPodcast}
                  onMouseLeave={handleMouseLeavePodcast}>
                    <Link to="/category/Podcast" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>
                  <div className='search-list-item'>
                    <span >Podcast</span>
                    <img 
                  src={
                    podcastIsHovered
                      ? podcastOrangeImgPath
                      : isHovered
                      ? podcastWhiteImgPath
                      : scrollPosition === 0
                      ? podcastWhiteImgPath
                      : podcastWhiteImgPath
                  }
                  alt="Podcast"
                  className="podcast"
                  />
                  
                </div>
                </Link>
              </li>
              <li onMouseEnter={handleMouseEnterTv}
                  onMouseLeave={handleMouseLeaveTv}>
                    <Link to="/category/TV" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>
                  <div className='search-list-item'>
                    <span >VideoTV</span>
                    <img 
                  src={
                    tvIsHovered
                      ? tvOrangeImgPath
                      : isHovered
                      ? tvWhiteImgPath
                      : scrollPosition === 0
                      ? tvWhiteImgPath
                      : tvWhiteImgPath
                  }
                  alt="VideoTV"
                  className="tv"
                  />
                  
                </div>
                </Link>
              </li>
              <li onMouseEnter={handleMouseEnterRadio}
                  onMouseLeave={handleMouseLeaveRadio}>
                    <Link to="/category/Radio" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>
                  <div className='search-list-item'>
                    <span >Radio</span>
                    <img 
                  src={
                    radioIsHovered
                      ? radioOrangeImgPath
                      : isHovered
                      ? radioWhiteImgPath
                      : scrollPosition === 0
                      ? radioWhiteImgPath
                      : radioWhiteImgPath
                  }
                  alt="Radio"
                  className="radio"
                  />
                  
                </div>
                </Link>
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