import React, { useEffect, useState } from 'react'
import './DatingApp.scss';
import ProfileDeck from '../../components/ProfileDeck/ProfileDeck';
import Menu from '../../components/Menu/Menu';
import ChattingWindow from '../../components/ChattingWindow/ChattingWindow';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { ChattingContext } from './DatingContext';
import {useAuth, useUserID} from '../../hooks/auth';
import Profile from '../../components/Profile/Profile';
import ProfileEdit from '../../components/ProfileEdit/ProfileEdit';
import CallWindow from '../../components/CallWindow/CallWindow';

export default function DatingApp(props) {
    const [chatting, setChatting] = useState(false);
    const [viewingProfile, setViewingProfile] = useState(false);
    const navigate = useNavigate()
    
    const [isAuthenticated, setAuthenticated] = useAuth();
    
    
    useEffect(() => {
        if(!isAuthenticated){
            window.alert("Not authentication")
            navigate("/");
        }
    }, [])
    return(
        <div className="app">
            <ChattingContext.Provider value={[chatting, setChatting]}>
                <Menu viewingProfile = {viewingProfile} setViewingProfile = {setViewingProfile} />
                <section className="deck">
                        <Routes>
                            <Route element = {
                                <React.Suspense fallback = {"loading..."}>
                                    <ChattingWindow />
                                </React.Suspense>
                            } path="/messages/:target_id" key="/messages/:target_id" />;
                            <Route exact ={true} element = {
                                <React.Suspense fallback = {"loading..."}>
                                    <Profile />
                                </React.Suspense>
                            } path="/profile" key="/profile" />;
                            <Route exact ={true} element = {
                                <React.Suspense fallback = {"loading..."}>
                                    <ProfileEdit />
                                </React.Suspense>
                            } path="/profile/edit" key="/profile/edit" />;
                            <Route exact ={true} element = {
                                    <CallWindow />
                            } path="/call/:target_id" key="/call/:target_id" />;
                            <Route exact ={true} element = {
                                <React.Suspense fallback = {"loading..."}>
                                    <ProfileDeck />
                                </React.Suspense>
                            } path="/" key="/" />;

                        </Routes>
                    
                </section>
            </ChattingContext.Provider>
        </div>
    )
};
