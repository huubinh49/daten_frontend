
import React, { useEffect, useRef } from 'react';

const Video = ({ peer, fullName }) => {
  const refVideo = useRef(null);

  useEffect(() => {
    if (peer) {
      peer.on('stream', (stream) => {
        refVideo.current.srcObject = stream;
      });
    }
  }, [peer]);

  return (
    <div className="peer-video" style={{ display: 'flex', flexDirection: 'column' }}>
      <video autoPlay ref={refVideo} playsInline />
      <span>{fullName}</span>
    </div>
  );
};

export default Video;