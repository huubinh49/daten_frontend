import React, { memo, useContext, useEffect, useState } from 'react'
import { Tabs, Tab, Image } from 'react-bootstrap';
import Matches from '../Matches/Matches';
import {MessageTab, Avatar} from '../MessageTab/MessageTab';
import logo from '../../logo.svg';
import { ChattingContext } from '../../pages/DatingApp/DatingContext';
import {Link} from 'react-router-dom';
import "./Menu.scss";
import useProfile from '../../hooks/profile';
import profileAPI from '../../api/profileAPI';
import {useUserID} from '../../hooks/auth';
import { useNavigate } from 'react-router';
function Menu(props) {
    const [key, setKey] = useState('matches');
    const [chatting, setChatting] = useContext(ChattingContext);
    const [profile, setProfile] = useProfile();
    const [userId, setUserId] = useUserID();
    const navigate = useNavigate();
    useEffect(()=>{
        const initializeState = async () => {    
            try{
                if(userId && (!profile || profile == 'undefined' || !Object.keys(profile).length)){
                    const res = await profileAPI.get(userId);
                    setProfile(res.profile);
                }
            }catch(error){
                console.error(error);
                if(error.response.status === 401)
                navigate('/');
            }
            
        }
        initializeState();
    }, []);
    
    return(
        <aside className="menu">
            <div className="menu-header">
                <Link to="/dating/profile" className = "header-profile" onClick = {() => {
                    props.setViewingProfile(true);
                }}>
                    <Avatar className="profile-avt" style={{
                        width: "40px",
                        height: "40px",
                        border: "2px solid white"
                    }} img_url = {profile.photos? profile.photos[0]: ""} />

                    <h2 className="profile-name">{profile.fullName}</h2>
                </Link>
                
                <Link to="/dating" className = "header-action" style={{
                    pointerEvents: (chatting || props.viewingProfile)? "all": "none",
                    visibility: (chatting || props.viewingProfile)? "visible": "hidden"
                }} onClick = {() => {
                    setChatting(false);
                    props.setViewingProfile(false);
                }}>
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