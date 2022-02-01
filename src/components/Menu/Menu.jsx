import React, { memo, useContext, useEffect, useState } from 'react'
import { Tabs, Tab, Image } from 'react-bootstrap';
import Matches from '../Matches/Matches';
import {MessageTab, Avatar} from '../MessageTab/MessageTab';
import logo from '../../logo.svg';
import { ChattingContext } from '../../pages/DatingApp/DatingContext';
import {Link} from 'react-router-dom';
import "./Menu.scss";

function Menu(props) {
    const [key, setKey] = useState('matches');
    const [chatting, setChatting] = useContext(ChattingContext);
    const [userProfile, setUserProfile] = useState("")
    useEffect(() => {
      const user_profile = JSON.parse(sessionStorage.getItem("profile"));
      setUserProfile(()=> user_profile)
    }, []);
    
    return(
        <aside className="menu">
            <div className="menu-header">
                <Link to="/profile" className = "header-profile">
                    <Avatar className="profile-avt" style={{
                        width: "40px",
                        height: "40px",
                        border: "2px solid white"
                    }} img_url = {userProfile? userProfile.photos[0]: ""} />

                    <h2 className="profile-name">{userProfile.fullName}</h2>
                </Link>
                <Link to="/dating" className = "header-action" style={{
                    pointerEvents: chatting? "all": "none",
                    visibility: chatting? "visible": "hidden"
                }} onClick = {() => setChatting(false)}>
                     <Image src={logo} fluid  style ={{
                            width: "18px",
                            height: "18px"
                        }}/>
                </Link>
            </div>
            <div className="menu-body">
                <Tabs
                    id="controlled-tab"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                >
                    <Tab eventKey="private" title="Private">
                        <MessageTab is_private={true}/>
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
export default memo(Menu)