// components/Podcasts.js

import React from 'react';
import '../styles/Podcasts.css';

const Podcasts = () => {
  // List of YouTube video URLs
  const videoUrls = [
    'https://www.youtube.com/embed/urOtaJpfl-I?si=8bUvKQimcN9lSyX2',
    'https://www.youtube.com/embed/IyqDueEf7vM?si=1uK3GsQ2n_xOcfEG',
    'https://www.youtube.com/embed/Jr2hgkey6X0?si=1ARBZk4NWfgWRLlL',
    // Add more video URLs as needed
  ];

  return (
    <div className="podcasts-container">
      <h2 className="podcasts-header">Δείτε τα τελευταία μας podcasts</h2>
      {videoUrls.map((url) => (
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
    </div>
  );
};

export default Podcasts;
