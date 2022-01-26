import React, { memo, useCallback, useState } from 'react'
import ProfileCard from '../ProfileCard/ProfileCard'
import "./ProfileDeck.scss";
const ProfileDeck = (props) => {
    // TODO: get matched partner of user profile from cached
    const [profiles, setProfiles] = useState([])
    
    const removeProfile = (id)=>{
            setProfiles((old_profiles)=> [  ...old_profiles.filter((profile, idx) => profile.user_id !== id)]);
    }

    return(
        <div className="card-deck">
            {
                profiles.map(
                        (profile, idx) => <ProfileCard {...profile} key={idx} removeProfile = {removeProfile}/>
                )
            }
        </div>
        
    )
}

export default memo(ProfileDeck);