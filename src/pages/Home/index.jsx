import React, { useEffect, useState } from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header'
import LoginForm from '../../components/LoginForm/LoginForm';
import LoginModal from '../../components/LoginModal/LoginModal';
import useAuth from '../../hooks/auth';
import { useNavigate } from 'react-router';
import "./HomePage.scss";
import axiosClient from '../../api/axiosClient';
import profileAPI from '../../api/profileAPI';

const HomePage = (props) => {
    const navigate = useNavigate();
    // Variables for control login modal
    const [showLoginModal, setLoginModalShow] = useState(false);
    const [fullscreenModal, setFullscreenModal] = useState(true);
    const {isAuthenticated, tryAutoSignIn} = useAuth();
    const closeLoginModal = () => setLoginModalShow(false);
    const openLoginModal = async () => {
        const user_id = sessionStorage.getItem("user_id")
        if (isAuthenticated && user_id) {
            try {
                const res = await profileAPI.get(user_id);
                console.log(res)
                if(res.profile != null){
                    sessionStorage.setItem("profile", JSON.stringify(res.profile));
                    navigate("/dating")
                }else{
                    navigate("/profile")                    
                }
            } catch (error) {
                console.log(error)
            }   
        }else{
            setFullscreenModal("md-down")    
            setLoginModalShow(true)   
        }
    };
   
    useEffect(async () => {
        await tryAutoSignIn();
        const user_id = sessionStorage.getItem("user_id")
        if (isAuthenticated && user_id) {
            profileAPI.get(user_id).then(
                res => {
                    console.log(res)
                    if(res.profile != null){
                        sessionStorage.setItem("profile", JSON.stringify(res.profile));
                        navigate("/dating")
                    }else{
                        navigate("/profile")                    
                    }
                }
            )
            .catch (error => {
                console.log(error)
            })
        }
    }, [])
    // Variables for control login form
    const [showLoginForm, setLoginFormShow] = useState(false);
    const [fullscreenForm, setFullscreenForm] = useState(true);
    const closeLoginForm = () => setLoginFormShow(false);
    const openLoginForm = () => {
        closeLoginModal();
        setFullscreenForm("md-down")    
        setLoginFormShow(true);
    };
    
    return(
        <>
            <Header />
            <section id="home">
                <Container fluid>
                    <LoginModal openLoginForm={openLoginForm} show={showLoginModal} fullscreen={fullscreenModal} onHide={closeLoginModal} handleClose={closeLoginModal}/>
                    <LoginForm show={showLoginForm} fullscreen={fullscreenForm} onHide={closeLoginForm} handleClose={closeLoginModal}/>
                    <Row>   
                        <Col className="home_col home_col-center" md={12} lg={6} style={{
                            background: `#ffffff url('${process.env.PUBLIC_URL}/home_bg.png') no-repeat center center`,
                            backgroundSize: 'cover'
                        }}>
                            <Image className="home_couple" src="./home_couple.png" />
                        </Col>
                        <Col className="home_col home_col-content" md={12} lg={6}>
                            <div className="content">
                                <h2 className="content_title">Make a Difference Today</h2>
                                <p className="content_description">
                                    Let's explore all features for lovebird couples.
                                    Private dating, video call, watch movie together. 
                                </p>
                                <button className="content_button" onClick = {openLoginModal}>
                                    Explore
                                </button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section id="features">
                <Container fluid>
                    <Row>
                        <Col md={12} lg={4} className="features_col" style={{
                            background: `rgba(0, 0, 0, 0.7) url('${process.env.PUBLIC_URL}/private_bg.png') no-repeat center center`,
                            backgroundSize: 'cover',
                            backgroundBlendMode: "darken"
                        }}>
                            <div className="content">
                                <h2 className="content_title">
                                    Private Dating
                                </h2>
                                <p className="content_description">
                                Find your soulmate without any caring about appearance
                                </p>
                            </div>
                        </Col> 
                        <Col md={12} lg={4} className="features_col" style={{
                            background: `rgba(0, 0, 0, 0.7) url('${process.env.PUBLIC_URL}/watch_movie_bg.png') no-repeat center center`,
                            backgroundSize: 'cover',
                            backgroundBlendMode: "darken"
                        }}>
                            <div className="content">
                                <h2 className="content_title">
                                    Watch movie together
                                </h2>
                                <p className="content_description">
                                    Narrow the geography distance
                                </p>
                            </div>
                        </Col> 
                        <Col md={12} lg={4} className="features_col" style={{
                            background: `rgba(0, 0, 0, 0.7) url('${process.env.PUBLIC_URL}/suitable_bg.png') no-repeat center center`,
                            backgroundSize: 'cover',
                            backgroundBlendMode: "darken"
                        }}>
                            <div className="content">
                                <h2 className="content_title">
                                    Dating with the one you like
                                </h2>
                                <p className="content_description">
                                Find the one that suitable with you by swiping right
                                </p>
                            </div>
                        </Col> 
                    </Row>
                </Container>
            </section>
            <section id="story">
                <Container>
                    <Row>
                        <Col className="story_col story_col-content" md={12} lg={6}>
                            <div className="content">
                                <h2 className="content_title">
                                    My Story
                                </h2>
                                <h4 className="content_subtitle">
                                 How It All Started
                                </h4>
                                <p className="content_description">
                                    ​I have used many different dating apps for 3 years. None of them focus on the experience of you and your matcher after they matched. That is the motivation for me to create this dating web app, not only matching but also dating.
                                </p>
                            </div>
                        </Col>
                        <Col className="story_col image-wrapper" md={12} lg={6}>
                            <Image className="col_item col_item-top" src="./story_img_1.png" />
                            <Image className="col_item col_item-bottom" src="./story_img_2.png" />
                        </Col>
                    </Row>
                </Container>
            </section>
            <Footer />
        </>
    )
}

export default HomePage;