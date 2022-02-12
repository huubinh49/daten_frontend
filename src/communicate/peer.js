import Peer from 'peerjs';
import socket from 'socket.io-client';
const initializePeerConnection = () => {
    return new Peer('', {
        host: process.env.PEER_JS_ENDPOINT, // (something like localhost:9000)
        port: 9000,
        secure: true,
        debug: 3,
        config: {
            'iceServers': [
                { url: 'stun:stun1.l.google.com:19302' },
                {
                    url: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                }
            ]
        }
    });
}
const initializeSocketConnection = () => {
    return socket.connect("localhost:5000", {// need to provide backend server endpoint 
                              // (ws://localhost:5000) if ssl provided then
                              // (wss://localhost:5000) 
        secure: true, 
        reconnection: true, 
        rejectUnauthorized: false,
        reconnectionAttempts: 10
    });
}
class Connection {
    videoContainer = {};
    settings;
    streaming = false;
    myPeer;
    socket;
    isSocketConnected = false;
    isPeersConnected = false;
    myPeerID = ''; // my peer id
    peers = {};
    constructor(settings) {
        this.settings = settings;
        this.myPeer = initializePeerConnection();
        this.socket = initializeSocketConnection();
        if (this.socket) this.isSocketConnected = true;
        if (this.myPeer) this.isPeersConnected = true;
        this.initializePeersEvents();
        this.initializeSocketEvents();
    }
    
    initializeSocketEvents = () => {
        this.socket.on('connect', () => {
            console.log('Socket peer connected');
        });
        this.socket.on('user-disconnected', (peerID) => {
            console.log('user disconnected: ', peerID);
            this.peers[peerID] && this.peers[peerID].close();
            this.removeVideo(peerID);
        });
        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
        this.socket.on('error', (err) => {
            console.log('Socket error', err);
        });
        this.socket.on('display-media', (data) => {
            if (data.value) 
                checkAndAddClass(this.getVideo(data.userID), 'displayMedia');
            else 
                checkAndAddClass(this.getVideo(data.userID), 'userMedia');
        });
        // Listen call request from other user
        this.socket.on("call", (data) => {
            let response = {
                'fromUID': localStorage.getItem("user_id"),
                'toUID': data.fromUID,
                'available': true,
                'peerID': ''
            }
            if(!this.streaming){
                response.peerID = this.myPeerID; // my peer id
                this.socket.emit("call-info", response)
            }else{
                response.available = false;
                this.socket.emit("reject-call", response)
            }
        })
        // If this user online or not calling, we can call them
        this.socket.on("call-info", (data) => {
            this.connectToUser(data)
        })
        // else we cant call
        this.socket.on("reject-call", (data) => {
            // TODO: Notify user that the receiver not accept
            console.log("That user rejected your call")
        })
        this.socket.on('user-video-off', (data) => {
            changeMediaView(data.id, data.status);
        });
    }
    
    initializePeersEvents = () => {
        this.myPeer.on('open', async (id) => {
            const { userDetails } = this.settings;
            //every time when connection established with peerjs server it will return one unique id for each user it would be like phone number
            // we will use that unique id for establishing a connection with another user.
            this.myPeerID = id;  // my peer id
            const userData = {
                peerId: id, ...userDetails // {peerId, userId}
            }
            console.log('Peers connected', userData);
            this.socket.emit('peer-connected', userData);
            await this.setNavigatorToStream();
        });
        this.myPeer.on('error', (err) => {
            console.log('peer connection error', err);
            this.myPeer.reconnect();
        })
    }
    
    setNavigatorToStream = async () => {
        const stream = await this.getVideoAudioStream()
        if (stream) {
            this.streaming = true;
            this.settings.updateInstance('streaming', true);
            this.createVideo({ id: this.myPeerID, stream }); // my peer id
            this.setPeersListeners(stream);
        }
    }
    
    getVideoAudioStream = (video=true, audio=true) => {
        let quality = this.settings.params?.quality;
        if (quality) quality = parseInt(quality);
        // When this method is called, the browser will request the user for permission to access the Camera/Microphone
        const myNavigator = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia || navigator.mediaDevices.msGetUserMedia;
        return myNavigator({
            video: video ? {
                frameRate: quality ? quality : 12,
                noiseSuppression: true,
                width: {min: 640, ideal: 1280, max: 1920},
                height: {min: 480, ideal: 720, max: 1080}
            } : false,
            audio: audio,
        });
    }
    
    setPeersListeners = (stream) => {
        this.myPeer.on('call', (call) => {// When we join someone's room we will receive a call from them
            console.log(call)
            
            var acceptsCall = window.confirm("Someone are calling you, do you want to accept it?");
            if(acceptsCall){
                this.socket.emit("call-established", {
                    'caller': call.metadata.id // peerID of caller
                })
                call.answer(stream);
                call.on('stream', (userVideoStream) => {
                    this.createVideo({ id: call.metadata.id, stream: userVideoStream }); // Create a video tag for them
                });
                call.on('close', () => {
                    console.log('Closing peers listeners', call.metadata.id);
                    this.removeVideo(call.metadata.id);
                });
                call.on('error', () => {
                    console.log('Peer error');
                    this.removeVideo(call.metadata.id);
                });
                this.peers[call.metadata.id] = call;
            }
        });
    }
    // Socket
    callUser(userData){
        this.socket.emit("call", {
            'fromUID': localStorage.getItem("user_id"),
            'toUID': userData.id,
        })
    }
    async connectToUser(userData)  {
        const stream = await this.getVideoAudioStream()
        const { peerId } = userData;
        const call = this.myPeer.call(peerId, stream, { metadata: { id: this.myPeerID } }); // my peer id
        call.on('stream', (userVideoStream) => {
            this.createVideo({ id: peerId, stream: userVideoStream, userData });
        });
        call.on('close', () => {
            console.log('Closing new user', peerId);
            this.removeVideo(peerId);
        });
        call.on('error', () => {
            console.log('Peer error')
            this.removeVideo(peerId);
        })
        this.peers[peerId] = call;
    }
    
    createVideo = (createObj) => {
        if (!this.videoContainer[createObj.id]) {
            this.videoContainer[createObj.id] = {
                ...createObj,
            };
            const roomContainer = document.getElementById('room-container');
            const videoContainer = document.createElement('div');
            const video = document.createElement('video');
            video.srcObject = this.videoContainer[createObj.id].stream;
            video.id = createObj.id;
            video.autoplay = true;
            if (this.myPeerID === createObj.id) video.muted = true;
            videoContainer.appendChild(video)
            roomContainer.append(videoContainer);
        } else {
            if(document.getElementById(createObj.id))
            document.getElementById(createObj.id).srcObject = createObj.stream;
        }
    }
    
    reInitializeStream = (video, audio, type='userMedia') => {
        const media = type === 'userMedia' ? this.getVideoAudioStream(video, audio) : navigator.mediaDevices.getDisplayMedia();
        return new Promise((resolve) => {
            media.then((stream) => {
                const myVideo = this.getVideo();
                if (type === 'displayMedia') {
                    this.toggleVideoTrack({audio, video});
                    this.listenToEndStream(stream, {video, audio});
                    this.socket.emit('display-media', true);
                }
                checkAndAddClass(myVideo, type);
                this.createVideo({ id: this.myPeerID, stream });
                this.replaceStream(stream);
                resolve(true);
            });
        });
    }
    
    removeVideo = (id) => {
        delete this.videoContainer[id];
        const video = document.getElementById(id);
        if (video) video.remove();
    }
    
    destroyConnection = () => {
        const myMediaTracks = this.videoContainer[this.myPeerID]?.stream.getTracks();
        if(myMediaTracks)
        myMediaTracks.forEach((track) => {
            track.stop();
        })
        this.streaming = true;
        this.socket.disconnect();
        this.myPeer.destroy();
    }
    
    getVideo = (id=this.myPeerID) => {
        return document.getElementById(id);
    }
    
    listenToEndStream = (stream, status) => {
        const videoTrack = stream.getVideoTracks();
        if (videoTrack[0]) {
            videoTrack[0].onended = () => {
                this.socket.emit('display-media', false);
                this.reInitializeStream(status.video, status.audio, 'userMedia');
                this.settings.updateInstance('displayStream', false);
                this.toggleVideoTrack(status);
            }
        }
    };
    
    toggleVideoTrack = (status) => {
        const myVideo = this.getVideo();
        if (myVideo && !status.video && myVideo.srcObject) 
        myVideo.srcObject.getVideoTracks().forEach((track) => {
            if (track.kind === 'video') {
                track.enabled = status.video;
                this.socket.emit('user-video-off', {id: this.myPeerID, status: true});
                changeMediaView(this.myPeerID, true);
                !status.video && track.stop();
            }
        });
        else if (myVideo) {
            this.socket.emit('user-video-off', {id: this.myPeerID, status: false});
            changeMediaView(this.myPeerID, false);
            this.reInitializeStream(status.video, status.audio);
        }
    }
    
    toggleAudioTrack = (status) => {
        const myVideo = this.getVideo();
        if (myVideo && myVideo.srcObject) 
            myVideo.srcObject.getAudioTracks().forEach((track) => {
            if (track.kind === 'audio')
                track.enabled = status.audio;
            status.audio ? this.reInitializeStream(status.video, status.audio) : track.stop();
        });
    }
    replaceStream = (mediaStream) => {
        Object.values(this.peers).map((peer) => {
            if(peer.peerConnection)
            peer.peerConnection.getSenders().map((sender) => {
                if(sender.track.kind == "audio") {
                    if(mediaStream.getAudioTracks().length > 0){
                        sender.replaceTrack(mediaStream.getAudioTracks()[0]);
                    }
                }
                if(sender.track.kind == "video") {
                    if(mediaStream.getVideoTracks().length > 0){
                        sender.replaceTrack(mediaStream.getVideoTracks()[0]);
                    }
                }
            });
            else
            console.log('Not have peer.peerConnection')
        })
    }
}



const checkAndAddClass = (video, type='userMedia') => {
    if (video?.classList?.length === 0 && type === 'displayMedia')
        video.classList.add('display-media');
    else
        video.classList.remove('display-media');
}

const changeMediaView = (peerId, status) => {
    const userVideoDOM = document.getElementById(peerId);
    if (status) {
        const clientPosition = userVideoDOM.getBoundingClientRect();
        const createdCanvas = document.createElement("SPAN");
        createdCanvas.className = peerId;
        createdCanvas.style.position = 'absolute';
        createdCanvas.style.left = `${clientPosition.left}px`;
        createdCanvas.style.top = `${clientPosition.top}px`;
        // createdCanvas.style.width = `${userVideoDOM.videoWidth}px`;
        // createdCanvas.style.height = `${clientPosition.height}px`;
        createdCanvas.style.width = '100%';
        createdCanvas.style.height = '100%';
        createdCanvas.style.backgroundColor = 'green';
        userVideoDOM.parentElement.appendChild(createdCanvas);
    } else {
        const canvasElement = document.getElementsByClassName(peerId);
        if (canvasElement[0]) canvasElement[0].remove();
    }
}

export function createConnectionInstance(settings={}) {
    return new Connection(settings);
}