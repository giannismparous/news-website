import { Helmet } from 'react-helmet-async';
import '../styles/Radio.css';
import React, { useEffect } from 'react';

const Radio = () => {

  useEffect(() => {
    // Scroll to the top of the page with smooth behavior when the page is loaded
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []); // Empty dependency array ensures it runs only once, when the component mounts

  return (
    <div className="radio-container">
      <Helmet>
          <title>Radio</title>  
          <meta name="description" content={`Οι τελευταίες ραδιοφωνικές μεταδόσεις του syntaktes.gr`}/>
          <link rel="canonical" href={`/radio`}/>
      </Helmet>
        <h2 className="external-video-header">Radio</h2>
        {/* <div className="video-container">
            <iframe
            width="320"
            height="350"
            src="http://e-resellers.gr/node/965fm/whm_player/player.html#"
            title="R/S ergozomenon evoias"
            frameBorder="0"
            allowFullScreen
            ></iframe>
        </div> */}
    </div>
  );
};

export default Radio;
