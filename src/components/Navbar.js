import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { useMediaQuery } from 'react-responsive'; // Import media query hook
import Hamburger from 'hamburger-react'; // Import Hamburger component
import '../styles/Navbar.css';

const syntaktesBlackImgPath = process.env.PUBLIC_URL +'/syntaktes.png';
const syntaktesWhiteImgPath = process.env.PUBLIC_URL +'/syntaktes-white.png';
const searchBlackImgPath = process.env.PUBLIC_URL +'/icons/search-black.png';
const searchWhiteImgPath = process.env.PUBLIC_URL +'/icons/search-white.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [logoIsHovered, setLogoIsHovered] = useState(false);

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar" style={{ backgroundColor: (isHovered || (isMobile && menuOpen)) ? 'rgb(23,20,38)' : scrollPosition === 0 ? 'transparent' : 'rgba(23,20,38,0.9)' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {isMobile ? (
        <div className="nav-bar-items-container">
          <Link to="/" className="hermesview-link">
          {!isMobile2 && <img src={syntaktesBlackImgPath} alt="syntaktes logo" style={{ height: "20px", width:"80px"}}/>}
          {isMobile2 && <img src={syntaktesBlackImgPath} alt="syntaktes logo" className="hermesview" style={{ height: "20px", width:"80px"}} />}
          </Link>
          {!isMobile2 && <Hamburger
            label="Show menu"
            rounded
            hideOutline={false}
            direction="left"
            size={100}
            color="white"
            duration={0.8}
            toggled={menuOpen}
            toggle={toggleMenu}
          />}
          {isMobile2 && <Hamburger
            label="Show menu"
            rounded
            hideOutline={false}
            direction="left"
            size={30}
            color="white"
            duration={0.8}
            toggled={menuOpen}
            toggle={toggleMenu}
          />}
        </div>
      ) : (
        <div className="logo-container">
          <Link to="/" className="logo-container" onClick={toggleMenu}>
            <img src={((scrollPosition === 0 && !isHovered) || logoIsHovered) ? syntaktesBlackImgPath : syntaktesWhiteImgPath} onMouseEnter={handleMouseEnterLogo} onMouseLeave={handleMouseLeaveLogo} alt="Company Logo" className="logo"/>
          </Link>
        </div>
      )}
      {isMobile && (
        <div className={`mobile-menu-overlay ${menuOpen ? 'visible' : ''}`} onClick={toggleMenu}></div>
      )}
      <ul className={`nav-links ${menuOpen ? 'nav-links-activated' : 'nav-links-deactivated'}`}>
        <div className='nav-links-text'>
          <img src={((scrollPosition === 0 && !isHovered) || logoIsHovered) ? searchBlackImgPath : searchWhiteImgPath} onMouseEnter={handleMouseEnterLogo} onMouseLeave={handleMouseLeaveLogo} alt="Search" className="search"/>
          <li><Link to="/" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Media</Link></li>
          <li><Link to="/category/Πολιτισμός" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Πολιτισμός</Link></li>
          <li><Link to="/category/Οικονομία" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Οικονομία</Link></li>
          <li><Link to="/category/Πολιτική" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Πολιτική</Link></li>
          <li><Link to="/category/Κοινωνία" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Κοινωνία</Link></li>
          <li><Link to="/category/Κόσμος" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Κόσμος</Link></li>
          <li><Link to="/category/Γνώση" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Γνώση</Link></li>
          <li><Link to="/contact" onClick={toggleMenu} className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>Επικοινωνία</Link></li>
        </div>
        <li className="social-media-list">
          <a href="https://www.facebook.com/profile.php?id=61555932080153" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>
            <FontAwesomeIcon icon={faFacebookF}  size='lg'/>
          </a>
          <a href="https://www.instagram.com/hermes_view/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>
            <FontAwesomeIcon icon={faInstagram} size='lg'/>
          </a>
          <a href="http://www.linkedin.com/shareArticle?mini=true&url=www.hermesview.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={`nav-link-item ${(scrollPosition === 0 && !isHovered && !isMobile) ? 'colored' : 'white'}`}>
            <FontAwesomeIcon icon={faLinkedinIn} size='lg'/>
          </a>
        </li>
      </ul>
      {!isMobile && (
        <div className="menu-toggle" onClick={toggleMenu}>
          <div className={`hamburger ${menuOpen ? 'active' : ''}`}></div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
