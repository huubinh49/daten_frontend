import React, { memo, useContext, useState } from 'react'
import { Tabs, Tab, Image } from 'react-bootstrap';
import Matches from '../Matches/Matches';
import {Message, Avatar} from '../Message/Message';
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
      setUserProfile(()=> user_profile.img_url)
    }, []);
    
    return(
        <aside className="menu">
            <div className="menu-header">
                <div className = "header-profile">
                    <Avatar className="profile-avt" style={{
                        width: "40px",
                        height: "40px",
                        border: "2px solid white"
                    }} img_url = {userProfile.img_url} />

                    <h2 className="profile-name">{user_profile.name}</h2>
                </div>
                <Link to="/dating/" className = "header-action" style={{
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
                        <Message is_private={true}/>
                    </Tab>
                    <Tab eventKey="matches" title="Matches">
                        <Matches />
                    </Tab>
                    <Tab eventKey="message" title="Message">
                        <Message />
                    </Tab>
                </Tabs>
            </div>
        </aside>
    )
};
export default memo(Menu)