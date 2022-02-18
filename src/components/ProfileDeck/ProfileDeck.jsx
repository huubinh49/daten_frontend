import React, { memo, useCallback, useEffect, useState } from 'react'
import { Col, Container, Row, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import evaluateAPI from '../../api/evaluateAPI';
import { useAuth } from '../../hooks/auth';
import ProfileCard from '../ProfileCard/ProfileCard'
import logo from '../../logo.svg';
import "./ProfileDeck.scss";
const ProfileDeck = (props) => {
    // get matched partner of user profile from cached
    const [profiles, setProfiles] = useState([])
    const navigate = useNavigate();
    const [isAuthenticated, setAuthenticated] = useAuth();
    const loadMore = () => {
        evaluateAPI.get().then(
            res =>{
                setProfiles((prevProfiles) => [
                    ...prevProfiles,
                    ...res.profiles
                ]);
            }
        ).catch(error => {
            if(error.response.status == 401){
                setAuthenticated(false);
                navigate("/")
               console.log(error.response);
            }
        });
        
    }
    useEffect(() => {
        loadMore();
    }, []);
    const removeProfile = (id)=>{
            setProfiles((old_profiles)=> [  ...old_profiles.filter((profile, idx) => profile.userId  !== id)]);
    }

    return(
        <Container style ={{
            height: "100%",
            width: "100%"
        }}>
            <Row className="card-deck">
                <Col xl={5} lg={8} md = {12} style = {{
                    position: "relative",
                    height: "100%",
                    maxWidth: "400px"
                }}>
                    {
                    profiles.map(
                                (profile, idx) => <ProfileCard profile = {profile} key={idx} removeProfile = {removeProfile}/>
                        )
                    }    
                    {
                        !profiles.length &&
                        <div className = "lackOfProfiles">
                            <div className = "empty-icon">
                                <Image src={logo} fluid style={{
                                    width: "100px",
                                    height: "100px"
                                }} />
                            </div>
                            <p>You swiped all of others profile</p>
                        </div>
                    }
                </Col>
            </Row>
        </Container>
        
    )
}

export default memo(ProfileDeck);