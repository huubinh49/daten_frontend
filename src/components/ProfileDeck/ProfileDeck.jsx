import React, { memo, useCallback, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import evaluateAPI from '../../api/evaluateAPI';
import ProfileCard from '../ProfileCard/ProfileCard'
import "./ProfileDeck.scss";
const ProfileDeck = (props) => {
    // get matched partner of user profile from cached
    const [profiles, setProfiles] = useState([])
    const navigate = useNavigate();
    
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
               // TODO: Handle error when dont have profile
               console.log(error.response);
               navigate("/")
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
                <Col lg={4} md = {12} style = {{
                    position: "relative",
                    height: "100%"
                }}>
                    {
                    profiles.map(
                                (profile, idx) => <ProfileCard profile = {profile} key={idx} removeProfile = {removeProfile}/>
                        )
                    }    
                </Col>
            </Row>
        </Container>
        
    )
}

export default memo(ProfileDeck);