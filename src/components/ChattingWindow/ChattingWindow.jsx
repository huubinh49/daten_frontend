import React, { memo, useContext, useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ButtonGroup, Card, Col, Container, Row } from 'react-bootstrap'
import { Avatar } from '../MessageTab/MessageTab'
import { Link } from 'react-router-dom'
import "./ChattingWindow.scss";
import { ChattingContext } from '../../pages/DatingApp/DatingContext';
import Picker from 'emoji-picker-react';
import Button from '@restart/ui/esm/Button'
import profileAPI from '../../api/profileAPI'
import messageAPI from '../../api/messageAPI'
import { SocketContext } from '../../socket/socket'
const Infinite = require('react-infinite');

const LoadingSpinner = (props) => (
    <div className="infinite-load">
            Loading...
    </div>
)
const Message = (props) => (
    <div style = {props.styte} className = {`message ${props.isMine? 'me': ''}`}>
        {props.content}
    </div>
)
function ChattingWindow(props) {
    const [chatting, setChatting] = useContext(ChattingContext);
    const [typingMessage, setTypingMessage] = useState('')
    const [choosingEmoji, setChoosingEmoji] = useState(false);
    const [currentImg, setCurrentImg] = useState(0);
    const [targetUser, setTargetUser] = useState(null);
    const currentMessagePage = useRef(0);
    const [messages, setMessages] = useState([]);
    const messageBox = useRef(null);
    const [infiniteLoading, setInfiniteLoading] = useState(false);

    const socket = useContext(SocketContext);
    const { target_id } = props.match.params
    const user_id = useRef();
    useEffect( async () => {
        const target_user = await profileAPI.get(target_id);
        user_id.current =  sessionStorage.getItem('user_id');
        setTargetUser(target_user);
        socket.emit("addUser", user_id.current);
        socket.on("getMessage", handleNewMessage);
        try {
            setInfiniteLoading(true);
            // Get initial message
            const res = await messageAPI.get(target_id, currentMessagePage.current++);
            console.log(res)
            setInfiniteLoading(false);
            // setMessages(res.data);
        } catch (err) {
            console.log(err);
        }
    }, [socket]);
    
    const handleNewMessage = (arrivalMessage) => {
        arrivalMessage && arrivalMessage.senderId == target_id &&
        setMessages((prev) => [...prev, arrivalMessage]);
    };

    const infiniteLoadMessage  = () => {
        setInfiniteLoading(true);
        messageAPI.get(target_id, currentMessagePage.current++)
        .then(res => {
            console.log(res.data)
            // setMessages(prevMessages => [...prevMessages, res.data])
            setInfiniteLoading(false);
        })
        .catch(err => {
            console.log(err)
            setInfiniteLoading(false);
        })
    }
    
    const messageChanging = (event)=>{
        setTypingMessage(()=> event.target.value)
    }
    const onEmojiClick = (event, emojiObject) => {
        setTypingMessage((oldMessage)=> oldMessage+ emojiObject.emoji);
      };
    
    const handleEmojiButton = (event) =>{
        event.preventDefault();
        setChoosingEmoji((oldState)=>!oldState);
    }
    const handleSubmitButton = async (event) => {
        event.preventDefault();
        const message = {
          senderId: user_id.current,
          recipientId: target_id,
          messageBody: typingMessage
        };
    
        socket.emit("sendMessage", message);
        try {
          const res = await messageAPI.create(message);
          setMessages([...messages, res.data]);
          setTypingMessage("");
        } catch (err) {
          console.log(err);
        }
    };
    
    
    const handleCardClick = (event)=>{

        const rect = event.target.getBoundingClientRect()
        const direction = (event.clientX- rect.left - rect.width/2) > 0 ? 1 : -1;
        const newIdx = currentImg  + direction;
        if(newIdx >= 0 && newIdx < targetUser.img_urls.length){
            setCurrentImg(newIdx);
        }
    }
    


    return (
        <Container className="chatting" fluid={true}>
            <Row>
                <Col className="box" sm = {12} md = {12} lg ={7}>
                    <div className="box-header">
                        <div className="header-info">
                            <Avatar {...props} style={{
                                width:"50px",
                                height:"50px",
                                border: "5px solid white"
                            }} />
                            <h3>{`You matched with ${targetUser.fullName} on 12/21/2021`}</h3>
                        </div>
                        <Link className="header-action" to="/dating" onClick={()=> setChatting(false)}>
                            <svg class="Sq(24px) P(4px)" viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true" role="presentation"><path class="" d="M14.926 12.56v-1.14l5.282 5.288c1.056.977 1.056 2.441 0 3.499-.813 1.057-2.438 1.057-3.413 0L11.512 15h1.138l-5.363 5.125c-.975 1.058-2.438 1.058-3.495 0-1.056-.813-1.056-2.44 0-3.417l5.201-5.288v1.14L3.873 7.27c-1.137-.976-1.137-2.44 0-3.417a1.973 1.973 0 0 1 3.251 0l5.282 5.207H11.27l5.444-5.207c.975-1.139 2.438-1.139 3.413 0 1.057.814 1.057 2.44 0 3.417l-5.2 5.288z"></path></svg>
                        </Link>
                    </div>
                    <div className = 'box-body' ref = {messageBox}>
                        <Infinite 
                                elementHeight={50}
                                displayBottomUpwards 
                                infiniteLoadBeginEdgeOffset={200}
                                onInfiniteLoad={infiniteLoadMessage}
                                loadingSpinnerDelegate={LoadingSpinner}
                                isInfiniteLoading={infiniteLoading}
                                onInfiniteLoad={infiniteLoadMessage}
                                useWindowAsScrollContainer
                                >
                            {/* insert messages for subsequent pages at this point */}
                            {
                                messages.map(message =>(
                                    <Message content = {message.messageBody} style={{
                                        height: '50px'
                                    }} isMine = {message.senderId == user_id.current}  />
                                ))
                            }
                        </Infinite>
                    </div>
                    <div className="box-footer">
                        <form>
                            <textarea className="message" placeholder="Type a message" maxLength={3000} name="" id="" cols="30" value={typingMessage} onChange={messageChanging}></textarea>
                            <div className = "action">
                                <button className="emoji-button" onClick={handleEmojiButton} style={{
                                    border: choosingEmoji? "2px solid #f8a81f": "none"
                                }}>
                                    <svg class="Sq(40px) My(8px)" viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true" role="presentation"><g fill="none" fill-rule="nonzero"><circle cx="10" cy="10" r="10" transform="translate(2 2)" fill="#f0f2f4"></circle><path d="M12 15.3c1.398 0 2.58-.876 3.066-2.1H8.934A3.298 3.298 0 0012 15.3m-2.1-3.9a.9.9 0 100-1.8.9.9 0 000 1.8m4.2 0a.9.9 0 100-1.8.9.9 0 000 1.8M12 16.8a4.8 4.8 0 110-9.6 4.8 4.8 0 010 9.6M12 6a6 6 0 100 12 6 6 0 000-12z" fill="#f8a81f"></path></g></svg>
                                </button>
                                <button type="submit" className = "submit" onClick={handleSubmitButton}>SEND</button>
                            </div>
                            <div className ="emoji-window" style={{
                                display: choosingEmoji? "block": "none"
                            }}>
                                <Picker disableSearchBar={true} onEmojiClick={onEmojiClick} pickerStyle={{ width: '100%' }} />
                            </div>
                        </form>
                    </div>
                </Col>
                <Col className="" sm = {0} md = {0} lg ={5}>
                    <Card onClick={handleCardClick}>
                        <div className="img-indicator" style={{
                            position: "absolute",
                            top: "5px",
                            left: "5px",
                            width: "calc(100% - 10px)",
                            height: "6px",
                            display: "flex",
                            gap: "5px",
                            zIndex: "99"
                        }}>
                            {
                            targetUser.img_urls.map((value, idx) => <div className="img-indicator" style={{
                                    width: "100%",
                                    height: "6px",
                                    borderRadius:"5px",
                                    backgroundColor:(idx === currentImg)? "white" : "rgba(0, 0, 0, 0.2)",
                                }} key={idx} />)
                            }
                            
                        </div>
                        
                        <div className="card-img">
                            <Card.Img variant="top"  style={{
                                backgroundImage: `linear-gradient(to top, rgb(0, 0, 0), rgb(0, 0, 0, 0.3), transparent, transparent), url('${targetUser.img_urls[currentImg]}')`,
                                backgroundPosition: '50% 0%',
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                            }}/>
                            {targetUser.img_urls.length > 1 && <div className = "card-indicator">
                                <svg className="indicator indicator-left" viewBox="0 0 24 24"  aria-hidden="false" role="img"><path className="" d="M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z"></path><title id="bb01635153c894db">Back</title></svg>
                                <svg className="indicator indicator-right" viewBox="0 0 24 24"  aria-hidden="false" role="img"><path className="" d="M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z"></path><title id="feade9b75cd98b3d">Next</title></svg>
                            </div>}
                        </div>
                        
                        <Card.Body>
                        <Card.Title>
                            <span className="name disable-select">{targetUser.fllName}</span>
                            <span className="age disable-select">{targetUser.age}</span>
                        </Card.Title>
                        <Card.Text className = "disable-select">
                            <svg className="Va(m) Sq(16px)" viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true" role="presentation"><g transform="translate(2 5)" stroke="#fff" strokeWidth=".936" fill="none" fillRule="evenodd"><rect x="5.006" y="3.489" width="9.988" height="9.637" rx=".936"></rect><path d="M7.15 3.434h5.7V1.452a.728.728 0 0 0-.724-.732H7.874a.737.737 0 0 0-.725.732v1.982z"></path><rect x=".72" y="3.489" width="18.56" height="9.637" rx=".936"></rect></g></svg>
                            <span className = "disable-select">{targetUser.job}</span>
                        </Card.Text>
                        <Card.Text className = "disable-select">
                            <svg className="Va(m) Sq(16px)" viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true" role="presentation"><g stroke="#fff" strokeWidth=".936" fill="none" fillRule="evenodd"><path d="M19.695 9.518H4.427V21.15h15.268V9.52zM3.109 9.482h17.933L12.06 3.709 3.11 9.482z"></path><path d="M9.518 21.15h5.086v-6.632H9.518z"></path></g></svg>
                            <span className = "disable-select">Lives in {targetUser.address}</span>
                        </Card.Text>
                        <Card.Text className = "disable-select">
                            <svg className="Va(m) Sq(16px)" viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true" role="presentation"><g fill="#fff" stroke="#fff" strokeWidth=".5" fillRule="evenodd"><path d="M11.436 21.17l-.185-.165a35.36 35.36 0 0 1-3.615-3.801C5.222 14.244 4 11.658 4 9.524 4 5.305 7.267 2 11.436 2c4.168 0 7.437 3.305 7.437 7.524 0 4.903-6.953 11.214-7.237 11.48l-.2.167zm0-18.683c-3.869 0-6.9 3.091-6.9 7.037 0 4.401 5.771 9.927 6.897 10.972 1.12-1.054 6.902-6.694 6.902-10.95.001-3.968-3.03-7.059-6.9-7.059h.001z"></path><path d="M11.445 12.5a2.945 2.945 0 0 1-2.721-1.855 3.04 3.04 0 0 1 .641-3.269 2.905 2.905 0 0 1 3.213-.645 3.003 3.003 0 0 1 1.813 2.776c-.006 1.653-1.322 2.991-2.946 2.993zm0-5.544c-1.378 0-2.496 1.139-2.498 2.542 0 1.404 1.115 2.544 2.495 2.546a2.52 2.52 0 0 0 2.502-2.535 2.527 2.527 0 0 0-2.499-2.545v-.008z"></path></g></svg>
                            <span className = "disable-select">{targetUser.distance} kilometers away</span>
                        </Card.Text>
                        <Card.Text>
                            {targetUser.bio}
                        </Card.Text>
                        <Card.Footer>
                            <ButtonGroup>
                                <Button  className='card-btn'>UNMATCH</Button>
                                <Button className='card-btn'>REPORT</Button>
                            </ButtonGroup>
                        </Card.Footer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

ChattingWindow.propTypes = {

}

export default memo(ChattingWindow)

