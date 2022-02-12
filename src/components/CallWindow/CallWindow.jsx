import React, { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import CallIcon from '@material-ui/icons/CallEnd';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import { CircularProgress } from '@material-ui/core';
import { createConnectionInstance } from '../../communicate/peer';
import profileAPI from '../../api/profileAPI';
import { useNavigate, useParams } from 'react-router';
import { AppBar, Toolbar } from '@material-ui/core';

const CallWindow = (props) => {
    let socketInstance = useRef(null);
    const [micStatus, setMicStatus] = useState(true);
    const [camStatus, setCamStatus] = useState(true);
    const [streaming, setStreaming] = useState(false);
    const [displayStream, setDisplayStream] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const { target_id } = useParams();
    const navigate = useNavigate()
    const connectInstance = useRef(null);

    useEffect(() => {
        const profile = getProfile();
        delete profile.photos;
        delete profile.location;
        setUserDetails(profile);
        return () => {
            if(connectInstance.current)
            connectInstance.current.destroyConnection();
        }
    }, []);

    const getProfile = async ()=>{
        let profile = localStorage.getItem("profile")
        try{
            if(!profile || profile === 'undefined'){
                const user_id = localStorage.getItem("user_id")
                if(!user_id || user_id === 'undefined'){
                    navigate('/')
                }
                
                profile = await profileAPI.get(user_id)
            }
            return profile
        }catch(error){
            return null;
        }
    }
    useEffect(() => {
        if (userDetails) startConnection();
        
    }, [userDetails]);

    const startConnection = () => {
        connectInstance.current = createConnectionInstance({
            updateInstance: updateFromInstance,
            quality: 12,
            userDetails
        });
        connectInstance.current.callUser({
            id: target_id
        })
    }

    const updateFromInstance = (key, value) => {
        if (key === 'streaming') setStreaming(value);
        if (key === 'displayStream') setDisplayStream(value);
    }

    useLayoutEffect(() => {
        const appBar = document.getElementsByClassName('app-navbar');
        if (appBar && appBar[0]) appBar[0].style.display = 'none';
        return () => {
            if (appBar && appBar[0]) appBar[0].style.display = 'block';
        } 
    });

    const handleDisconnect = () => {
        if(connectInstance.current)
        connectInstance.current.destroyConnection();
        navigate(`/dating/messages/${target_id}`);
    }

    const handleMic = () => {
        const { getVideo, reInitializeStream } = connectInstance.current;
        const myVideo = getVideo();
        if (myVideo && myVideo.srcObject) myVideo.srcObject.getAudioTracks().forEach((track) => {
            if (track.kind === 'audio')
                // track.enabled = !micStatus;
                micStatus ? track.stop() : reInitializeStream(camStatus, !micStatus);
        });
        setMicStatus(!micStatus);
    }

    const handleCam = () => {
        if (!displayStream) {
            const { toggleVideoTrack } = connectInstance.current;
            toggleVideoTrack({ video: !camStatus, audio: micStatus });
            setCamStatus(!camStatus);
        }
    }

    const toggleScreenShare = () => {
        const { reInitializeStream, toggleVideoTrack } = connectInstance.current;
        displayStream && toggleVideoTrack({video: false, audio: true});
        reInitializeStream(false, true, !displayStream ? 'displayMedia' : 'userMedia').then(() => {
            setDisplayStream(!displayStream);
            setCamStatus(false);
        });
    }

    return (
        <React.Fragment>
            {userDetails !== null && !streaming && 
                <div className="stream-loader-wrapper">
                    <CircularProgress className="stream-loader" size={24} color="primary" />
                </div>
            }
            <div id="room-container"></div>
            <AppBar className="footbar-wrapper" color="primary">
                <Toolbar className={`footbar-tool ${props.className}`}>
                    <div className="footbar-title">Video Call</div>
                    <div className="footbar-wrapper">
                        {streaming && <div className="status-action-btn mic-btn" onClick={handleMic} title={micStatus ? 'Disable Mic' : 'Enable Mic'}>
                            {micStatus ? 
                                <MicIcon></MicIcon>
                                :
                                <MicOffIcon></MicOffIcon>
                            }
                        </div>}
                        <div className="status-action-btn end-call-btn" onClick={handleDisconnect} title="End Call">
                            <CallIcon></CallIcon>
                        </div>
                        {streaming && <div className="status-action-btn cam-btn" onClick={handleCam} title={camStatus ? 'Disable Cam' : 'Enable Cam'}>
                            {camStatus ? 
                                <VideocamIcon></VideocamIcon>
                                :
                                <VideocamOffIcon></VideocamOffIcon>
                            }
                        </div>}
                    </div>
                    <div>
                        <div className="screen-share-btn" onClick={toggleScreenShare}>
                            <h4 className="screen-share-btn-text">{displayStream ? 'Stop Screen Share' : 'Share Screen'}</h4>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    )
}

export default memo(CallWindow);