import React, { useEffect, useState } from 'react'
import './DatingApp.scss';
import ProfileDeck from '../../components/ProfileDeck/ProfileDeck';
import Menu from '../../components/Menu/Menu';
import ChattingWindow from '../../components/ChattingWindow/ChattingWindow';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { ChattingContext } from './DatingContext';
import useAuth from '../../hooks/auth';
import Profile from '../../components/Profile/Profile';
import ProfileEdit from '../../components/ProfileEdit/ProfileEdit';

export default function DatingApp(props) {
    const [chatting, setChatting] = useState(false);
    const [viewingProfile, setViewingProfile] = useState(false);
    const navigate = useNavigate()
    
    const {
        isAuthenticated, tryAutoSignIn
    } = useAuth();

    
    useEffect(() => {
        tryAutoSignIn();
        if(isAuthenticated){
           
        }else{
            navigate("/")
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
                                } path="/messages/:user_id" key="/messages/:id" />;
                            <Route element = {
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
