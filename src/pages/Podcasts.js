import React from 'react';
import '../styles/Podcasts.css';
import { Helmet } from 'react-helmet-async';

const Podcasts = () => {
  // List of Spotify podcast URLs
  const podcastUrls = [
    'https://open.spotify.com/embed/episode/0YrftJbot66wj3TzklkPBF/video?utm_source=generator',
    'https://open.spotify.com/show/your-podcast-id-2',
    // Add more podcast URLs as needed
  ];

  return (
    <div className="podcasts-container">
      <Helmet>
          <title>Podcasts</title>  
          <meta name="description" content={`Τα τελευταία podcasts του syntaktes.gr`}/>
          <link rel="canonical" href={`/podcasts`}/>
      </Helmet>
      <h2 className="podcasts-header">Δείτε τα τελευταία μας podcasts</h2>
      {/* <iframe  src="https://open.spotify.com/embed/episode/0YrftJbot66wj3TzklkPBF/video?utm_source=generator" width="624" height="351" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe> */}
    </div>
  );
};

// Function to extract Spotify podcast ID from URL
function getPodcastId(url) {
  const parts = url.split('/');
  return parts[parts.length - 1]; // Assuming the last part of URL is the podcast ID
}

export default Podcasts;
