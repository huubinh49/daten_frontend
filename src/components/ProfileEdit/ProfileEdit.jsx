import React, { memo, useEffect, useRef, useState } from 'react'
import { Card} from 'react-bootstrap'
import { Form, Container, Row, Col, Image } from 'react-bootstrap'
import "./ProfileEdit.scss"
import { useNavigate } from 'react-router';
import profileAPI from '../../api/profileAPI';
import { Formik } from 'formik';
import * as yup from "yup";
import { Link } from 'react-router-dom';
  
const schema = yup.object().shape({
    gender: yup.string()
        .required('Gender is required'),
    interested: yup.string()
        .required('Interested in gender is required')
})

// TODO: Auto fill data into form
const ProfileEdit = (props) => {
    const fields = [
        "work",
        "bio",
        "gender",
        "interested",
        "address"
    ]
    const [photos, setPhotos] = useState([...new Array(9)])
    const [photosUrl, setPhotosUrl] = useState([...new Array(9)])
    const [message, setMessage] = useState('')
    const [profile, setProfile] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [currentPosition, setCurrentPosition] = useState([0, 0])
    const navigate = useNavigate();


    const resizeObserver = useRef(new ResizeObserver(entries => {
        entries.forEach(entry =>{
            entry.target.style.height = `${entry.contentRect.width*1.3}px`
        })
    }))
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
            setProfile(my_profile)
        }catch(error){
            console.log(error);
        } 
    
    const handleSubmit = async (event, formikProps) => {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData();
        photos.forEach((photo, idx) =>{
            if(photosUrl[idx] && (idx >=  profile.photos.length || photosUrl[idx] != profile.photos[idx]))
            formData.append(`photo-${idx}`, photo)
        })
        // Append form data 
        for(const field in fields){
            if(profile[field] !== formikProps.values[field])
            formData.append(field, formikProps.values[field]);
        }
        try {
            const res = await profileAPI.update(formData);
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
       
    };
    const handleShowAlert = (errorMessage) => {
        setMessage( () => `${errorMessage}`)
        setShowAlert(true);
        setTimeout(()=>{
            // Close alert in 5s
            setShowAlert(false);
        }, 5000)
    }

    return(
        <Formik
        validateOnMount={true}
        validationSchema={schema}
        initialValues={{
            bio: profile.bio || '',
            gender: profile.genderId || '1',
            interested: profile.interestedInGender || '0',
            address: profile.address || '',
            work: profile.work || ''
        }}
    >
        {(formikProps) => (
        <Container className = 'profile-window'>
            <Row style = {{
                width: "100%",
                height: '80%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Col style={{
                height: '100%'
            }} lg={7} md = {12}>
                <Card className="edit disable-select" >
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
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="bio"
                                    value={formikProps.values.bio}
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                >
                                    <Form.Label>Biography</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        className={formikProps.touched.bio ? formikProps.errors.bio ? "error" : "valid" : "normal"}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="address"
                                    value={formikProps.values.address}
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                >
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        className={formikProps.touched.address ? formikProps.errors.address ? "error" : "valid" : "normal"}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="work"
                                    value={formikProps.values.work}
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                >
                                    <Form.Label>Work</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        className={formikProps.touched.work ? formikProps.errors.work ? "error" : "valid" : "normal"}
                                    />
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
                            </Col>
                        </Row>
                        
                    </Container>
                    <Card.Footer>
                        <Button onClick = {(event) => handleSubmit(event, formikProps)} className = "btn btn-submit" type = "submit">Save</Button>
                    </Card.Footer>
                </Card>
            </Col>
            </Row>
        </Container>
        )}
        </Formik>
    )
}
export default memo(ProfileEdit);
