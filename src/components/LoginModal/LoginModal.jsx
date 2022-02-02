import * as authActions from '../../redux/authentication/auth_actions';
import React, { memo, useState } from 'react'
import { Modal, Image, Alert } from 'react-bootstrap';
import ReactFacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import logo from '../../logo.svg';
import './LoginModal.scss';
import { useDispatch } from 'react-redux';
import Button from '@restart/ui/esm/Button';
import { useNavigate } from 'react-router';
import profileAPI from '../../api/profileAPI';

function LoginModal(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [message, setMessage] = useState('')
    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = (errorMessage) => {
        setMessage( () => `${errorMessage}`)
        setShowAlert(true);
        setTimeout(()=>{
            setShowAlert(false);
        }, 5000)
    }

    const handleResultOAuth =  (response, provider) => {
        console.log(response)
        if(response.error){
            console.log(response.error)
        }else{
            dispatch(authActions.OAuthLogin(response, provider, async () => {
                const user_id = localStorage.getItem("user_id")
                try {
                    const res = await profileAPI.get(user_id);
                    if(res.profile != null){
                        localStorage.setItem("profile", JSON.stringify(res.profile));
                        navigate("/dating")
                    }else{
                        navigate("/profile")                    
                    }
                } catch (error) {
                    console.log(error)
                }   
                props.handleClose();
            }, (err) => {
                try{
                    handleShowAlert(err.response.data.error) 
                }catch(error){
                    handleShowAlert(err) 
                }
                
            }));

        }
    }

    return (
            <Modal {...props}>
                <Modal.Header closeButton>
                    <Image className="modal-logo" src = {logo}></Image>
                </Modal.Header>
                <Modal.Body>
                    <h3>Get Started</h3>
                    <Alert variant="danger" style = {{
                        width: "100%"
                    }} show={showAlert}>
                        {message}
                    </Alert>
                    <ReactFacebookLogin
                        className = "button"
                        appId = "614013699824803"
                        cssClass = "button button__socialLink facebookLink"
                        textButton = "Login with Facebook"
                        callback = {(res)=>handleResultOAuth(res, 'facebook')}
                        icon = "fa fa-facebook"
                        fields = "email, first_name, last_name"
                    ></ReactFacebookLogin>
                    <GoogleLogin
                      clientId="101757029643-enradtr7ppvqsn233o3j3udi5s5tv7a8.apps.googleusercontent.com"
                      buttonText="Login with Google"
                      icon = {true}
                      render={renderProps => (
                        <div onClick = {renderProps.onClick} disabled={renderProps.disabled} className = "button button__socialLink googleLink">Login with Google<i className="fa fa-google" aria-hidden="true"></i></div>
                      )}
                      onSuccess={(res)=>handleResultOAuth(res, 'google')}
                      onFailure={(res)=>handleResultOAuth(res, 'google')}
                      cookiePolicy={'single_host_origin'}
                    />
                    <Button onClick={() => props.openLoginForm()} className="button">
                        Login with email
                    </Button>
                </Modal.Body>
                <Modal.Footer>
                    <p>By clicking Log In, you agree to our <a href="https://www.freeprivacypolicy.com/live/41a51d2b-5fac-44ed-b086-0acb2d1832c3">Privacy Policy</a>. We do NOT use your data for any process Machine Learning or AI.</p>
                </Modal.Footer>
            </Modal>
    )
}

export default memo(LoginModal)
