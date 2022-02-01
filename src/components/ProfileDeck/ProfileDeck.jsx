import React, { memo, useCallback, useEffect, useState } from 'react'
import evaluateAPI from '../../api/evaluateAPI';
import profileAPI from '../../api/profileAPI';
import ProfileCard from '../ProfileCard/ProfileCard'
import "./ProfileDeck.scss";
const ProfileDeck = (props) => {
    // get matched partner of user profile from cached
    const [profiles, setProfiles] = useState([])
    const loadMore = () => {
        evaluateAPI.get().then(
            res =>{
                setProfiles((prevProfiles) => [
                    ...prevProfiles,
                    ...res.profiles
                ]);
            }
        ).catch(error => {
            console.log(error)
        });
        
    }
    useEffect(() => {
        loadMore();
    }, []);
    const removeProfile = (id)=>{
            setProfiles((old_profiles)=> [  ...old_profiles.filter((profile, idx) => profile.userId  !== id)]);
    }

    return(
        <div className="card-deck">
            {
            profiles.map(
                        (profile, idx) => <ProfileCard profile = {profile} key={idx} removeProfile = {removeProfile}/>
                )
            }
        </div>
        
    )
}

export default memo(ProfileDeck);