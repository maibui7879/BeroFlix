import React from 'react';

const IframePlayer = ({ embedLink, iframeRef }) => {
  return (
    <div className="mt-6 mx-auto md:w-3/4" ref={iframeRef} style={{ aspectRatio: "16 / 9" }}>
      <iframe
        src={embedLink}
        frameBorder="0"
        width="100%"
        height="100%"
        title="Episode Video"
        allowFullScreen
      />
    </div>
  );
};

export default IframePlayer;
