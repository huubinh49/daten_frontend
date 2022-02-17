import React, { memo, useRef, useState } from 'react'
import * as authActions from '../../redux/authentication/auth_actions';
import { Modal, Image, Form, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import logo from '../../logo.svg';
import "./LoginForm.scss";
import Button from '@restart/ui/esm/Button';
import { ErrorMessage, Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router';

function LoginForm(props) {
    
    const [isSigningUp, setSigningUp] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
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
    const handleShowSuccess = () => {
        setShowSuccess(true);
        setTimeout(()=>{
            setShowSuccess(false);
        }, 5000)
    }
    const handleSignUpButton = (event, formikProps) => {
        event.preventDefault();
        event.stopPropagation();
        if(formikProps.isValid){
            setShowAlert(false);
            const formData = new FormData();
            formData.append('email', formikProps.values['email'])
            formData.append('password', formikProps.values['password'])
            dispatch(authActions.authSignup(formData, ()=>{
                handleShowSuccess();
            }, (err)=>{
                try{
                    handleShowAlert(err.response.data.error) 
                }catch(error){
                    handleShowAlert(err) 
                }
            }))
            
        }else{
            setShowSuccess(false);
            handleShowAlert("You must fill this form as the below instructions!")
        }
    } 
    const handleLoginButton = (event, formikProps) => {
        event.preventDefault();
        event.stopPropagation();
        if(formikProps.isValid || Object.keys(formikProps.errors).length == 1 && formikProps.errors.confirmPassword){
            setShowAlert(false);
            const formData = new FormData();
            formData.append('email', formikProps.values['email'])
            formData.append('password', formikProps.values['password'])
            dispatch(authActions.authLogin(formData, () => {
                navigate("/create-profile")
            }, (err)=>{
                try{
                    handleShowAlert(err.response.data.error) 
                }catch(error){
                    handleShowAlert(err) 
                }
            }))
        }else{
            setShowSuccess(false);
            handleShowAlert("You must fill this form as the below instructions!")
        }
    }

    const schema = yup.object().shape({
        email: yup.string()
                .required("Email is required")
                .email("Email is invalid"),
        password: yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters')
            .max(40, 'Password must not exceed 40 characters'),
        confirmPassword: yup.string()
            .required('Confirm Password is required')
            .oneOf([yup.ref('password'), null], 'Confirm Password does not match'),
    })
    return (
        <>
        
        <Modal {...props}>
            <Modal.Header closeButton>
                <Image className="modal-logo" src = {logo}></Image>
            </Modal.Header>
        <Modal.Body>
            <Modal.Title>Login with your email</Modal.Title>
            <Alert variant="danger" style = {{
                width: "100%"
            }} show={showAlert}>
                {message}
            </Alert>
            <Alert variant="success" style = {{
                width: "100%"
            }} show={showSuccess}>
                Sign up successfully, please log in with that account!
            </Alert>
            <Formik
                validateOnMount = {true}
                validationSchema={schema}
                initialValues={{ 
                    email: '', 
                    password: '',
                    confirmPassword: ''
                }}
            >
            {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                isValid,
                errors,
                setSubmitting
            }) => (
                <Form>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                            className = {touched.email? (errors.email? "error" : "valid"): "normal"}
                            type="email" 
                            placeholder="Enter email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />

                        <Form.Control.Feedback type="invalid"><ErrorMessage name="email"  /> </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            className = {touched.password? errors.password? "error" : "valid": "normal"}
                            type="password" 
                            placeholder="Password" 
                            value = {values.password}
                            onChange = {handleChange}
                            onBlur={handleBlur}
                            />
                        <Form.Control.Feedback type="invalid" ><ErrorMessage name="password"  /> </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    {
                    isSigningUp && <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control 
                            className = {touched.confirmPassword? errors.confirmPassword? "error" : "valid": "normal"}
                            type="password" 
                            placeholder="Confirm Password"
                            value = {values.confirmPassword}
                            onChange = {handleChange}
                            onBlur={handleBlur}
                            />
                            <Form.Control.Feedback type="invalid" ><ErrorMessage name="confirmPassword"  /> </Form.Control.Feedback>
                    </Form.Group>
                    }
                    
                    <div className="modal-action">
                        {
                            isSigningUp&&<Button onClick={(e) => handleSignUpButton(e,{ values, errors, isValid, setSubmitting})} className="button-signup" type="submit">
                            SIGN UP
                            </Button >
                        }
                        {
                            !isSigningUp&&<Button onClick={(e) => handleLoginButton(e, {values, errors, isValid, setSubmitting})} className="button-login" type="submit">LOGIN</Button>
                        }
                    </div>
                </Form>
            )}
            </Formik>
        </Modal.Body>
        <Modal.Footer>
            {isSigningUp && 
            <>
                <span>Already have an account?</span>
                <a className = "footer-action" onClick = {(event) => {
                    event.preventDefault();
                    setSigningUp(false);
                }}>Login</a>
            </>
            }
            {!isSigningUp && 
            <>
                <span>Do not have an account?</span>
                <a className = "footer-action" onClick = {(event) => {
                    event.preventDefault();
                    setSigningUp(true);
                }}>Sign up</a>
            </>
            }
        </Modal.Footer>
    </Modal>
    </>
    )
}

export default memo(LoginForm)
