import React, { createRef, memo, useEffect, useRef, useState } from 'react'
import { Form, Container, Row, Col, Image, Alert } from 'react-bootstrap'
import axiosClient from '../../api/axiosClient';
import "./ProfileForm.scss"
import { Formik } from 'formik';
import * as yup from "yup";
import Button from '@restart/ui/esm/Button';
import { useNavigate } from 'react-router';
import profileAPI from '../../api/profileAPI';

const dobLowerBound = new Date();
dobLowerBound.setFullYear(dobLowerBound.getFullYear() - 16);

const schema = yup.object().shape({
    name: yup.string()
        .required("Name is required")
        .max(40, 'Name must not exceed 40 characters'),
    dob: yup.date()
        .required(' Date of birth is required')
        .max(dobLowerBound, "You must be greater than 16 years old!")
        ,
    gender: yup.string()
        .required('Gender is required'),
    interested: yup.string()
        .required('Interested in gender is required')
})


function ProfileForm() {
    const [photos, setPhotos] = useState([...new Array(6)])
    const [photosUrl, setPhotosUrl] = useState([...new Array(6)])
    const [message, setMessage] = useState('')
    const [showAlert, setShowAlert] = useState(false);
    const [currentPosition, setCurrentPosition] = useState([0, 0])
    const navigate = useNavigate();

    const handleShowAlert = (errorMessage) => {
        setMessage( () => `${errorMessage}`)
        setShowAlert(true);
        setTimeout(()=>{
            setShowAlert(false);
        }, 5000)
    }

    const resizeObserver = useRef(new ResizeObserver(entries => {
        entries.forEach(entry =>{
            entry.target.style.height = `${entry.contentRect.width*1.3}px`
        })
    }))
    const handleSubmit = async (event, formikProps) => {
        event.preventDefault();
        event.stopPropagation();

        if(!formikProps.isValid ){
            handleShowAlert("You must fill as the below instruction!")
        }else if(photos.every((photo) => !photo)){
            handleShowAlert("You must upload at least one photo!")
        }else{
            const formData = new FormData();
            photos.forEach((photo, idx) =>{
                formData.append(`photo-${idx}`, photo)
            })
            formData.append("name", formikProps.values.name);
            formData.append("dob", formikProps.values.dob);
            formData.append("gender", formikProps.values.gender);
            formData.append("interested", formikProps.values.interested);
            formData.append("position", currentPosition);
            try {
                const res = await profileAPI.create(formData);
               if(res.error || !res.profile){
                   handleShowAlert(res.error)
               }else{
                    localStorage.setItem("profile", JSON.stringify(res.profile));
                    navigate("/dating")
               }
            } catch (ex) {
                if(ex.response.status != 409){
                    handleShowAlert(ex.response.data.error)
                    if(ex.response.data.error === "Invalid token"){
                        navigate("/")
                    }
                }else{
                    navigate("/dating")
                }
            }
        }
       
    };
    useEffect(() => {
        if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentPosition(()=> [position.coords.longitude, position.coords.latitude])
        });

        const photosEle = [...document.getElementsByClassName("photo-label")];
        photosEle.forEach(ele =>{
            resizeObserver.current.observe(ele, {box: 'border-box'})
        })
        return () => {
            photosEle.forEach(ele =>{
                resizeObserver.current.unobserve(ele)
            })   
        }
    }, [])
    return (
        <Formik
            validateOnMount={true}
            validationSchema={schema}
            initialValues={{
                name: '',
                gender: '1',
                interested: '0',
            }}
        >
            {(formikProps) => (
                <Form>
                    <Container>
                        <Row>
                            <Col>
                                <h1>Create Profile</h1>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                            <Alert variant="danger" style = {{
                                width: "100%"
                            }} show={showAlert}>
                                {message}
                            </Alert>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} sm={12}>
                                <Form.Group className="mb-3" controlId="name"
                                    value={formikProps.values.name}
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                >
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Name"
                                        className={formikProps.touched.name ? formikProps.errors.name ? "error" : "valid" : "normal"}
                                    />
                                    <Form.Control.Feedback type="invalid">{formikProps.errors.name}</Form.Control.Feedback>
                                    <Form.Control.Feedback type="valid">That's a beautiful name!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="dob"
                                    value={formikProps.values.dob}
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                >
                                    <Form.Label>Birthday</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        name="dob" 
                                        placeholder="Date of Birth"
                                        className={formikProps.touched.dob ? formikProps.errors.dob ? "error" : "valid" : "normal"}
                                        />
                                    
                                    <Form.Control.Feedback type="invalid">{formikProps.errors.dob}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="gender"
                                    value={formikProps.values.gender}
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                >
                                    <Form.Label>Gender</Form.Label>
                                    <div className="form-radio">
                                        <Form.Check
                                            value="1"
                                            inline
                                            label="Boy"
                                            name="gender"
                                            type="radio"
                                            defaultChecked={formikProps.values.gender === "1"}
                                            id={`gender-boy`}
                                        />
                                        <Form.Check
                                            value="0"
                                            inline
                                            label="Girl"
                                            name="gender"
                                            type="radio"
                                            defaultChecked={formikProps.values.gender === "0"}
                                            id={`gender-girl`}
                                        />
                                        <Form.Check
                                            value="-1"
                                            inline
                                            label="Other"
                                            name="gender"
                                            type="radio"
                                            defaultChecked={formikProps.values.gender === "-1"}
                                            id={`gender-other`}
                                        />
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="interested"
                                    value={formikProps.values.interested}
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                >
                                    <Form.Label>Show Me</Form.Label>
                                    <div className="form-radio">
                                        <Form.Check
                                            value="1"
                                            inline
                                            label="Boy"
                                            name="interested"
                                            type="radio"
                                            defaultChecked={formikProps.values.interested === "1"}
                                            id={`interested-boy`}
                                        />
                                        <Form.Check
                                            value="0"
                                            inline
                                            label="Girl"
                                            name="interested"
                                            type="radio"
                                            defaultChecked={formikProps.values.interested === "0"}
                                            id={`interested-girl`}
                                        />
                                        <Form.Check
                                            value="-1"
                                            inline
                                            label="Other"
                                            name="interested"
                                            type="radio"
                                            defaultChecked={formikProps.values.interested === "-1"}
                                            id={`interested-other`}
                                        />
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3" className = "form-location">
                                    <Form.Label>Your Current Position</Form.Label>
                                    <div className = "location"> 
                                        <Form.Control 
                                            type="text" 
                                            value = {`(${currentPosition[0]}; ${currentPosition[1]})`}
                                            disabled = {true}
                                        />
                                    </div>
                                    
                                </Form.Group>
                            </Col>
                            <Col md={6} sm={12}>
                                <Container>
                                    <Row>
                                        {
                                            photos.map((item, idx) => (
                                                <Col lg={4} md={6} sm={12}>
                                                    <Form.Group
                                                        controlId={`file-${idx}`}
                                                        className="profile-photo"
                                                        key = {idx}
                                                    >
                                                        <Form.Label className="photo-label" style={{
                                                            backgroundImage: photosUrl[idx] ? `url('${photosUrl[idx]}')` : "",
                                                            backgroundPosition: '50% 0%',
                                                            backgroundRepeat: "no-repeat",
                                                            backgroundSize: "cover",
                                                        }}>
                                                            {
                                                                photosUrl[idx]? 
                                                                <div onClick = {(event) =>{
                                                                    event.preventDefault();
                                                                    setPhotos((oldPhotos) => {
                                                                        oldPhotos[idx] = null
                                                                        return [...oldPhotos]
                                                                    })
                                                                    setPhotosUrl((oldPhotosUrl) => {
                                                                        oldPhotosUrl[idx] = null
                                                                        return [...oldPhotosUrl]
                                                                    })
                                                                }} className = "photo-icon photo-icon-remove">
                                                                    <Image src ={`${process.env.PUBLIC_URL}/remove.png`}></Image>
                                                                </div>:
                                                                <div className = "photo-icon photo-icon-add">
                                                                    <Image src ={`${process.env.PUBLIC_URL}/add.png`}></Image>
                                                                </div>
                                                            }
                                                        </Form.Label>
                                                        <Form.Control onChange={(event) => {
                                                            const photo = event.target.files[0];
                                                            setPhotos((oldPhotos) => {
                                                                oldPhotos[idx] = photo
                                                                return [...oldPhotos]
                                                            })
                                                            setPhotosUrl((oldPhotosUrl) => {
                                                                oldPhotosUrl[idx] = photo? URL.createObjectURL(photo) : null
                                                                return [...oldPhotosUrl]
                                                            })
                                                        }}
                                                            type="file" name="file" accept="image/*" />
                                                      
                                                    </Form.Group>
                                                </Col>))
                                        }
                                    </Row>
                                </Container>
                            </Col>
                        </Row>
                        <Row>
                            <Col className = "form-footer">
                                <Button onClick = {(event) => handleSubmit(event, formikProps)} className = "btn btn-submit" type = "submit">Submit</Button>
                            </Col>
                        </Row>
                    </Container>
                </Form>)}
        </Formik>
    )
}

export default memo(ProfileForm);
