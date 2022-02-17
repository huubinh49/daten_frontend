
import React, { useEffect, useRef, useState } from 'react';

const Video = ({ peer, fullName }) => {
  const refVideo = useRef(null);
  const [showName, setShowName] = useState(false)
  useEffect(() => {
    if (peer) {
      peer.on('stream', (stream) => {
        refVideo.current.srcObject = stream;
        // TODO: how event stream media works
        stream.getVideoTracks()[0].addEventListener("mute", event => {
          setShowName(true)
        })
        stream.getVideoTracks()[0].addEventListener("unmute", event => {
          setShowName(false)
        })
      });
    }
  }, [peer]);

  return (
    <div className="peer-video" style={{ display: 'flex', flexDirection: 'column' }}>
     {showName && <span className = "fullName">{fullName}</span>}
      <video autoPlay ref={refVideo} playsInline />
    </div>
  );
};

export default Video;