import React, { useEffect, useRef, useState, useContext, memo } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import useProfile from '../../hooks/profile';
import Video from './Video';
import { useParams } from 'react-router';
import microphone from '../../Icons/microphone.svg'
import microphonestop from '../../Icons/microphone-stop.svg'
import camera from '../../Icons/camera.svg'
import camerastop from '../../Icons/camera-stop.svg'
import share from '../../Icons/share.svg'
import fullscreen from '../../Icons/fullscreen.svg'
import minimize from '../../Icons/minimize.svg'
import { Container, Row, Col } from 'react-bootstrap'
import { DeviceContext } from '../../pages/DatingApp/DatingContext';
const CallWindow = (props) => {
    const [profile, setProfile] = useProfile();
    const [peers, setPeers] = useState([]);
    const [stream, setStream] = useState();
    const [audioMuted, setAudioMuted] = useState(false)
    const [videoMuted, setVideoMuted] = useState(false)
    const [isFullScreen, setFullScreen] = useState(false)
    const socketRef = useRef();
    const refVideo = useRef();
    const peersRef = useRef([]);
    const myPeer = useRef();
    const roomId = useParams();
    const isMobileDevice = useContext(DeviceContext);
    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                refVideo.current.srcObject = stream;
                setStream(stream);
                socketRef.current = io.connect("localhost:5000", {
                    // need to provide backend server endpoint 
                    // (ws://localhost:5000) if ssl provided then
                    // (wss://localhost:5000) 
                    secure: true,
                    reconnection: true,
                    rejectUnauthorized: false,
                    reconnectionAttempts: 10
                });
                // sending the user details and roomid to join in the room
                socketRef.current.emit('join-room', roomId, profile);

                socketRef.current.on('users-present-in-room', (users) => {
                    const peers = [];

                    // To all users who are already in the room initiating a peer connection
                    users.forEach((user) => {
                        const peer = createPeer(
                            user.socketId,
                            socketRef.current.id,
                            stream
                        );

                        if (user.userId == profile.userId) {
                            myPeer.current = peer;
                        }

                        peersRef.current.push({
                            peerId: user.socketId,
                            peer,
                            fullName: user.fullName,
                        });

                        peers.push({
                            peerId: user.socketId,
                            peerObj: peer,
                        });
                    });

                    setPeers(peers);
                });

                // once the users initiate signal we will call add peer
                // to acknowledge the signal and send the stream
                socketRef.current.on('user-joined', (payload) => {
                    const peer = addPeer(payload.signal, payload.callerId, stream);
                    peersRef.current.push({
                        peerId: payload.callerId,
                        peer,
                        fullName: payload.fullName,
                    });

                    setPeers((users) => [
                        ...users,
                        { peerId: payload.callerId, peerObj: peer },
                    ]);
                });

                // once the signal is accepted calling the signal with signal
                // from other user so that stream can flow between peers
                socketRef.current.on('signal-accepted', (payload) => {
                    const item = peersRef.current.find((p) => p.peerId === payload.id);
                    item.peer.signal(payload.signal);
                });

                // if some user is disconnected removing his references.
                socketRef.current.on('user-disconnected', (payload) => {
                    const item = peersRef.current.find((p) => p.peerId === payload);
                    if (item) {
                        item.peer.destroy();
                        peersRef.current = peersRef.current.filter(
                            (p) => p.peerId !== payload
                        );
                    }
                    setPeers((users) => users.filter((p) => p.peerId !== payload));
                });
            });
    }, []);
    // TODO: Dont show screen & cant stop sharing
    function shareScreen() {
        navigator.mediaDevices.getDisplayMedia({ cursor: true })
            .then(screenStream => {
                myPeer.current.replaceTrack(stream.getVideoTracks()[0], screenStream.getVideoTracks()[0], stream)
                refVideo.current.srcObject = screenStream
                screenStream.getTracks()[0].onended = () => {
                    myPeer.current.replaceTrack(screenStream.getVideoTracks()[0], stream.getVideoTracks()[0], stream)
                    refVideo.current.srcObject = stream
                }
            })
    }

    function createPeer(userToSignal, callerId, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on('signal', (signal) => {
            socketRef.current.emit('initiate-signal', {
                userToSignal,
                callerId,
                signal,
            });
        });

        return peer;
    }

    function addPeer(incomingSignal, callerId, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on('signal', (signal) => {
            socketRef.current.emit('ack-signal', { signal, callerId });
        });

        peer.signal(incomingSignal);

        return peer;
    }

    function toggleMuteAudio() {
        if (stream) {
            setAudioMuted(!audioMuted)
            stream.getAudioTracks()[0].enabled = audioMuted
        }
    }

    function toggleMuteVideo() {
        if (stream) {
            setVideoMuted(!videoMuted)
            stream.getVideoTracks()[0].enabled = videoMuted
        }
    }

    function endCall() {
        window.location.close();
    }

    return (
        <Container style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div className="my-video" style={{ display: 'flex', flexDirection: 'column' }}>
                <video muted ref={refVideo} autoPlay playsInline />
                <span>{profile.fullName}</span>
            </div>
            <Row>
                {peers.map((peer, index) => {
                    return (
                        <Col lg={6} md = {6} sm = {12}>
                            <Video
                                key={peersRef.current[index].peerId}
                                peer={peer.peerObj}
                                fullName={peersRef.current[index].fullName}
                            />
                        </Col>
                    );
                })}
            </Row>
            

            <Container className="controls__container">
                <Row>
                    <Col lg={2} md={2} sm={2}>
                        {
                            audioMuted ?
                                <span className="controls__icon" onClick={() => toggleMuteAudio()}>
                                    <img src={microphonestop} alt="Unmute audio" />
                                </span>
                                : <span className="controls__iconr" onClick={() => toggleMuteAudio()}>
                                    <img src={microphone} alt="Mute audio" />
                                </span>
                        }
                    </Col>
                    <Col lg={2} md={2} sm={2}>
                        {
                            videoMuted ?
                                <span className="controls__icon" onClick={() => toggleMuteVideo()}>
                                    <img src={camerastop} alt="Resume video" />
                                </span>
                                : <span className="controls__icon" onClick={() => toggleMuteVideo()}>
                                    <img src={camera} alt="Stop video" />
                                </span>
                        }
                    </Col>
                    {
                        !isMobileDevice &&
                        <Col lg={2} md={2} sm={2}>
                            <span className="controls__icon" onClick={()=>shareScreen()}>
                                <img src={share} alt="Share screen"/>
                            </span>
                        </Col>
                    }
                    <Col lg={2} md={2} sm={2}>
                        {
                            isFullScreen ?
                                <span className="controls__icon" onClick={()=>{setFullScreen(false)}}>
                                    <img src={minimize} alt="fullscreen"/>
                                </span>
                                : <span className="controls__icon" onClick={()=>{setFullScreen(true)}}>
                                    <img src={fullscreen} alt="fullscreen"/>
                                </span>
                        }
                    </Col>
                </Row>

            </Container>
        </Container>
    );
};

export default memo(CallWindow);