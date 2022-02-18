import React, { memo, useContext, useEffect, useState } from 'react'
import { Tabs, Tab, Image } from 'react-bootstrap';
import Matches from '../Matches/Matches';
import { MessageTab, Avatar } from '../MessageTab/MessageTab';
import logo from '../../logo.svg';
import { ChattingContext } from '../../pages/DatingApp/DatingContext';
import { Link } from 'react-router-dom';
import "./Menu.scss";
import useProfile from '../../hooks/profile';
import profileAPI from '../../api/profileAPI';
import { useUserID } from '../../hooks/auth';
import { useNavigate } from 'react-router';
import { SocketContext } from '../../communicate/socket'
import ringtone from '../../Sounds/ringtone.mp3'
import { Button } from '@material-ui/core';
import { Howl } from 'howler'
const ringtoneSound = new Howl({
    src: [ringtone],
    loop: true,
    preload: true
})

function Menu(props) {
    const [key, setKey] = useState('matches');
    const [chatting, setChatting] = useContext(ChattingContext);
    const [profile, setProfile] = useProfile();
    const socket = useContext(SocketContext);
    const [caller, setCaller] = useState('')
    const [userId, setUserId] = useUserID();
    const [receivingCall, setReceivingCall] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        const initializeState = async () => {
            try {
                if (userId && (!profile || profile == 'undefined' || !Object.keys(profile).length)) {
                    const res = await profileAPI.get(userId);
                    setProfile(res.profile);
                }
            } catch (error) {
                console.error(error);
                if (error.response.status === 401)
                    navigate('/');
            }

        }
        initializeState();
    }, []);
    useEffect(() => {
        if(userId && socket.connected){
            socket.emit("addUser", {
                'userId': userId
            });
            console.log("Add event call request!");
            
            socket.on("call-request", onCallHandle)
            socket.on("cancel-call", onCancelCallHandle)
        }
      
        return () =>{
            socket.off("call-request", onCallHandle)
            socket.off("cancel-call", onCancelCallHandle)
        }
    }, [socket.connected, userId])
    
    function acceptCall() {
        ringtoneSound.stop();
        setReceivingCall(false);
        socket.emit('accepted', { toUID: caller.fromUID })
        window.open(`http://localhost:3000/room/${caller.roomId}`, 'Video Call', 'width=500,height=500,toolbar=1,resizable=1');
    }
    function rejectCall() {
        ringtoneSound.stop();
        setReceivingCall(false);
        socket.emit('rejected', { toUID: caller.fromUID })
    }
    const onCallHandle = (data) => {
        window.alert("Somebody calling")
        ringtoneSound.play();
        setCaller(data)
        setReceivingCall(true);
    }

    const onCancelCallHandle = (data) => {
        ringtoneSound.stop();
        setCaller({})
        setReceivingCall(false);
    }
    return (
        <aside className="menu">
            {
                receivingCall &&
                <div className="incomingCallContainer  flex flex-column">
                    <div><span className="callerID">{caller.fullName}</span> is calling you!</div>
                    <div className="incomingCallButtons flex">
                        <Button name="accept" color="primary" variant="contained" onClick={() => acceptCall()}>Accept</Button>
                        <Button name="reject" color="secondary" variant="contained" onClick={() => rejectCall()}>Reject</Button>
                    </div>
                </div>
            }
            <div className="menu-header">
                <Link to="/dating/profile" className="header-profile" onClick={() => {
                    props.setViewingProfile(true);
                }}>
                    <Avatar className="profile-avt" style={{
                        width: "40px",
                        height: "40px",
                        border: "2px solid white"
                    }} img_url={profile.photos ? profile.photos[0] : ""} />

                    <h2 className="profile-name">{profile.fullName}</h2>
                </Link>

                <Link to="/dating" className="header-action" style={{
                    pointerEvents: (chatting || props.viewingProfile) ? "all" : "none",
                    visibility: (chatting || props.viewingProfile) ? "visible" : "hidden"
                }} onClick={() => {
                    setChatting(false);
                    props.setViewingProfile(false);
                }}>
                    <Image src={logo} fluid style={{
                        width: "18px",
                        height: "18px"
                    }} />
                </Link>
            </div>
            <div className="menu-body">
                <Tabs
                    id="controlled-tab"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                >
                    <Tab eventKey="private" title="Private">
                        <MessageTab is_private={true} />
                    </Tab>
                    <Tab eventKey="matches" title="Matches">
                        <Matches />
                    </Tab>
                    <Tab eventKey="message" title="Message">
                        <MessageTab />
                    </Tab>
                </Tabs>
            </div>
        </aside>

    )
};
export default Menu