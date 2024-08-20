import { Helmet } from 'react-helmet-async';
import '../styles/VideoTV.css';
import React from 'react';

const VideoTV = () => {
  // List of YouTube video URLs
  const videoUrls = [
    'https://www.youtube.com/embed/urOtaJpfl-I?si=8bUvKQimcN9lSyX2',
    'https://www.youtube.com/embed/IyqDueEf7vM?si=1uK3GsQ2n_xOcfEG',
    'https://www.youtube.com/embed/Jr2hgkey6X0?si=1ARBZk4NWfgWRLlL',
    // Add more video URLs as needed
  ];

  return (
    <div className="videotv-container">
      <Helmet>
          <title>Podcasts</title>  
          <meta name="description" content={`Τα τελευταία podcasts του syntaktes.gr`}/>
          <link rel="canonical" href={`/podcasts`}/>
      </Helmet>
      <h2 className="videotv-header">Δείτε τις τελευταίες μας εκπομπές</h2>
      {/* {videoUrls.map((url) => (
        <div className="video-container" key={url}>
          <iframe
            width="560"
            height="315"
            src={url}
            title={`YouTube Video ${url}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      ))}
      <div className="external-video-container">
        <h2 className="external-video-header">Radio</h2>
        <div className="video-container">
          <iframe
            width="320"
            height="350"
            src="http://e-resellers.gr/node/965fm/whm_player/player.html#"
            title="R/S ergozomenon evoias"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div> */}
    </div>
  );
};

export default VideoTV;
