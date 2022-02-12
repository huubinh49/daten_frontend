import React, { memo, useEffect, useRef, useState } from 'react'
import { Card} from 'react-bootstrap'
import { Form, Container, Row, Col, Image } from 'react-bootstrap'
import "./ProfileEdit.scss"
import { useNavigate } from 'react-router';
import profileAPI from '../../api/profileAPI';
import { Formik } from 'formik';
import * as yup from "yup";
import { Link } from 'react-router-dom';
import Button from '@restart/ui/esm/Button';
import useProfile from '../../hooks/profile';
import { useUserID } from '../../hooks/auth';
  
const schema = yup.object().shape({
    gender: yup.string()
        .required('Gender is required'),
    interested: yup.string()
        .required('Interested in gender is required')
})

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
    const [profile, setProfile] = useProfile();
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();


    const resizeObserver = useRef(new ResizeObserver(entries => {
        entries.forEach(entry =>{
            entry.target.style.height = `${entry.contentRect.width*1.3}px`
        })
    }))
    useEffect(async () => {
        if(!profile || profile == 'undefined' || !Object.keys(profile).length){
            try{
        
                const existingPhotoUrls = photosUrl;
                for(let idx in profile.photos){
                    existingPhotoUrls[idx] = profile.photos[idx]
                }
                setPhotosUrl(existingPhotoUrls);
            }catch(error){
                console.log(error);
            } 
        }
    }, [profile])
    
    useEffect(() => {
        const photosEle = [...document.getElementsByClassName("photo-label")];
        photosEle.forEach(ele =>{
            resizeObserver.current.observe(ele, {box: 'border-box'})
        })
        return () => {
            photosEle.forEach(ele =>{
                resizeObserver.current.unobserve(ele)
            })   
        }
    }, []);
    
    const handleSubmit = async (event, formikProps) => {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData();
        photos.forEach((photo, idx) =>{
            if(photosUrl[idx] && (idx >=  profile.photos.length || photosUrl[idx] != profile.photos[idx]))
            formData.append(`photo-${idx}`, photo)
        })
        // Append form data 
        for(const idx in fields){
            if(profile[fields[idx]] !== formikProps.values[fields[idx]])
            formData.append(fields[idx], formikProps.values[fields[idx]]);
        }
        try {
            const res = await profileAPI.update(formData);
            if(res.error || !res.profile){
                handleShowAlert(res.error)
            }else{
                setProfile(res.profile)
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
        }}>
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
                                                defaultValue={formikProps.initialValues.bio}
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
                                                defaultValue={formikProps.initialValues.address}
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
                                                defaultValue={formikProps.initialValues.work}
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
                                                            defaultChecked={formikProps.values.gender == "1"}
                                                            id={`gender-boy`}
                                                        />
                                                        <Form.Check
                                                            value="0"
                                                            inline
                                                            label="Girl"
                                                            name="gender"
                                                            type="radio"
                                                            defaultChecked={formikProps.values.gender == "0"}
                                                            id={`gender-girl`}
                                                        />
                                                        <Form.Check
                                                            value="-1"
                                                            inline
                                                            label="Other"
                                                            name="gender"
                                                            type="radio"
                                                            defaultChecked={formikProps.values.gender == "-1"}
                                                            id={`gender-other`}
                                                        />
                                                    </div>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="interested"
                                                    value={formikProps.values.interested}
                                                    onChange={formikProps.handleChange}
                                                    onBlur={formikProps.handleBlur}
                                                >
                                                    <Form.Label>Interested</Form.Label>
                                                    <div className="form-radio">
                                                        <Form.Check
                                                            value="1"
                                                            inline
                                                            label="Boy"
                                                            name="interested"
                                                            type="radio"
                                                            defaultChecked={formikProps.values.interested == "1"}
                                                            id={`interested-boy`}
                                                        />
                                                        <Form.Check
                                                            value="0"
                                                            inline
                                                            label="Girl"
                                                            name="interested"
                                                            type="radio"
                                                            defaultChecked={formikProps.values.interested == "0"}
                                                            id={`interested-girl`}
                                                        />
                                                        <Form.Check
                                                            value="-1"
                                                            inline
                                                            label="Other"
                                                            name="interested"
                                                            type="radio"
                                                            defaultChecked={formikProps.values.interested == "-1"}
                                                            id={`interested-other`}
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
    );
}
export default memo(ProfileEdit)