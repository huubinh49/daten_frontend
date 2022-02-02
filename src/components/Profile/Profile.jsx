import React, { memo, useEffect, useRef, useState } from 'react'
import { Card, CardImg } from 'react-bootstrap'
import "./Profile.scss"
import profileAPI from '../../api/profileAPI';
import { Link } from 'react-router-dom';
  

const currentYear = new Date().getFullYear()
const Profile = (props) => {

    const cardElem = useRef(null)
    const [currentImg, setCurrentImg] = useState(0);
    const [profile, setProfile] = useState({});
    useEffect(async () => {
        try{
            let my_profile = null;
            if(localStorage.getItem('profile')){
                my_profile = localStorage.getItem('profile')
            }else{
                const res = await profileAPI.get(localStorage.getItem('user_id'));
                my_profile = res.profile;
            }
            my_profile = JSON.parse(my_profile);
            console.log(my_profile)
            setProfile(my_profile)
        }catch(error){
            console.log(error);
        }
    }, []);
    useEffect(() => {
      console.log(profile)
    }, [profile]);
    
    const handleCardClick = (event)=>{

        const rect = event.target.getBoundingClientRect()
        const direction = (event.clientX- rect.left - rect.width/2) > 0 ? 1 : -1;
        const newIdx = currentImg  + direction;
        if(newIdx >= 0 && newIdx < profile.photos?.length){
            setCurrentImg(newIdx);
        }
    }
    return(
        <div className = 'profile-window'>
            <Card className="disable-select" >
                <div onClick = {handleCardClick} className="card-top disable-select" style={{
                        backgroundImage: `linear-gradient(to top, rgb(0, 0, 0), rgb(0, 0, 0, 0.3), transparent, transparent), url('${profile.photos? profile.photos[currentImg]: ""}')`,
                        backgroundPosition: '50% 0%',
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        
                    }}>
                    <div className="img-indicator" style={{
                        position: "absolute",
                        top: "5px",
                        left: "5px",
                        width: "calc(100% - 10px)",
                        height: "6px",
                        display: "flex",
                        gap: "5px",
                    }}>
                        {
                        profile.photos?.map((value, idx) => <div className="img-indicator" style={{
                                width: "100%",
                                height: "6px",
                                borderRadius:"5px",
                                backgroundColor:(idx === currentImg)? "white" : "rgba(0, 0, 0, 0.2)",
                            }} key={idx} />)
                        }
                        
                    </div>
                    {profile.photos?.length > 1 && <div className = "card-indicator">
                        <svg className="indicator indicator-left" viewBox="0 0 24 24"  aria-hidden="false" role="img"><path className="" d="M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z"></path><title id="bb01635153c894db">Back</title></svg>
                        <svg className="indicator indicator-right" viewBox="0 0 24 24"  aria-hidden="false" role="img"><path className="" d="M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z"></path><title id="feade9b75cd98b3d">Next</title></svg>
                    </div>}
                </div>
                
                <Card.Body>
                <Card.Title>
                    <span className="name disable-select">{profile.fullName}</span>
                    <span className="age disable-select">{currentYear - new Date(profile.dateOfBirth).getFullYear()}</span>
                </Card.Title>
                <Card.Text className = "disable-select">
                    <svg className="Va(m) Sq(16px)" viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true" role="presentation"><g transform="translate(2 5)" stroke="#fff" strokeWidth=".936" fill="none" fillRule="evenodd"><rect x="5.006" y="3.489" width="9.988" height="9.637" rx=".936"></rect><path d="M7.15 3.434h5.7V1.452a.728.728 0 0 0-.724-.732H7.874a.737.737 0 0 0-.725.732v1.982z"></path><rect x=".72" y="3.489" width="18.56" height="9.637" rx=".936"></rect></g></svg>
                    <span className = "disable-select">{props.job}</span>
                </Card.Text> 
                <Card.Text className = "disable-select">
                    <svg className="Va(m) Sq(16px)" viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true" role="presentation"><g stroke="#fff" strokeWidth=".936" fill="none" fillRule="evenodd"><path d="M19.695 9.518H4.427V21.15h15.268V9.52zM3.109 9.482h17.933L12.06 3.709 3.11 9.482z"></path><path d="M9.518 21.15h5.086v-6.632H9.518z"></path></g></svg>
                    <span className = "disable-select">Lives in {props.address}</span>
                </Card.Text> 
                <Card.Text className = "disable-select">
                    <svg className="Va(m) Sq(16px)" viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true" role="presentation"><g fill="#fff" stroke="#fff" strokeWidth=".5" fillRule="evenodd"><path d="M11.436 21.17l-.185-.165a35.36 35.36 0 0 1-3.615-3.801C5.222 14.244 4 11.658 4 9.524 4 5.305 7.267 2 11.436 2c4.168 0 7.437 3.305 7.437 7.524 0 4.903-6.953 11.214-7.237 11.48l-.2.167zm0-18.683c-3.869 0-6.9 3.091-6.9 7.037 0 4.401 5.771 9.927 6.897 10.972 1.12-1.054 6.902-6.694 6.902-10.95.001-3.968-3.03-7.059-6.9-7.059h.001z"></path><path d="M11.445 12.5a2.945 2.945 0 0 1-2.721-1.855 3.04 3.04 0 0 1 .641-3.269 2.905 2.905 0 0 1 3.213-.645 3.003 3.003 0 0 1 1.813 2.776c-.006 1.653-1.322 2.991-2.946 2.993zm0-5.544c-1.378 0-2.496 1.139-2.498 2.542 0 1.404 1.115 2.544 2.495 2.546a2.52 2.52 0 0 0 2.502-2.535 2.527 2.527 0 0 0-2.499-2.545v-.008z"></path></g></svg>
                    <span className = "disable-select">{props.distance} kilometers away</span>
                </Card.Text>
                <Card.Text>
                    {props.bio}
                </Card.Text>
                <Card.Footer>
                    <Link className="btn btn-link" to = "/dating/profile/edit">Edit Profile</Link>
                </Card.Footer>
                </Card.Body>
            </Card>
        </div>
    )
};
export default memo(Profile);
