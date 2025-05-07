import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import '../styles/Podcasts.css';

const Podcasts = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []); 
  
  // const podcastUrls = [
  //   'https://open.spotify.com/embed/episode/0YrftJbot66wj3TzklkPBF/video?utm_source=generator',
  //   'https://open.spotify.com/show/your-podcast-id-2',
  // ];

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

// function getPodcastId(url) {
//   const parts = url.split('/');
//   return parts[parts.length - 1];
// }

export default Podcasts;
