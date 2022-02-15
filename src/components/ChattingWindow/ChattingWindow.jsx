import React, { memo, useContext, useRef, useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { ButtonGroup, Card, Col, Container, Row } from 'react-bootstrap'
import { Avatar } from '../MessageTab/MessageTab'
import { Link, useParams } from 'react-router-dom'
import "./ChattingWindow.scss";
import { Howl } from 'howler'
import { ChattingContext } from '../../pages/DatingApp/DatingContext';
import Picker from 'emoji-picker-react';
import Button from '@restart/ui/esm/Button'
import profileAPI from '../../api/profileAPI'
import { SocketContext } from '../../communicate/socket'
import messageAPI from '../../api/messageAPI'
import Videocam from '@material-ui/icons/Videocam'
import CloseIcon from '@material-ui/icons/Close';
import { useNavigate } from 'react-router'
import { useUserID } from '../../hooks/auth'
import * as Chance from 'chance';
import useProfile from '../../hooks/profile'
import CallingModal from './CallingModal';

const chance = new Chance();
const LoadingSpinner = (props) => (
    <div className={`infinite-load ${props.isShow ? '' : 'notShow'}`}>
        <p>Loading...</p>
    </div>
)
const Message = (props) => (
    <div style={props.style} className={`message ${props.isMine ? 'me' : ''}`}>
        {props.content}
    </div>
)
const currentYear = new Date().getFullYear()
function ChattingWindow(props) {
    const [chatting, setChatting] = useContext(ChattingContext);
    const [calling, setCalling] = useState(false);
    const [typingMessage, setTypingMessage] = useState('')
    const [choosingEmoji, setChoosingEmoji] = useState(false);
    const [currentImg, setCurrentImg] = useState(0);
    const [targetUser, setTargetUser] = useState({});
    const currentMessagePage = useRef(0);
    const [messages, setMessages] = useState([]);
    const messageBox = useRef(null);
    const [infiniteLoading, setInfiniteLoading] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const socket = useContext(SocketContext);
    const { target_id } = useParams();
    const [userId, setUserId] = useUserID();
    const [profile, setProfile] = useProfile();
    const navigate = useNavigate()
    const scrollHandler = (event) => {
        // if (messageBox.current.scrollTop + messageBox.current.clientHeight + margin  >= messageBox.current.scrollHeight) {
        //     // infiniteLoadMessage();

        // }
        if (messageBox.current.scrollTop === 0) {
            infiniteLoadMessage();
        }
    }
    const id = useRef('')

    const initialize = async () => {
        const target_user = await profileAPI.get(target_id);
        setTargetUser(() => target_user.profile);
        const margin = 1;
        currentMessagePage.current = 0;
        messageBox.current && messageBox.current.addEventListener("scroll", scrollHandler);
        infiniteLoadMessage();
    }
    const scrollToBottom = useCallback(() => {
        const domNode = messageBox.current;
        if (domNode && firstLoad == true) {
            domNode.scrollTop = domNode.scrollHeight;
            console.log("scroll to bottom ---------------------")
            setFirstLoad(false);
        }
    }, []);

    useEffect(() => {
        initialize();
        return () => {
            messageBox.current && messageBox.current.removeEventListener("scroll", scrollHandler);
        }
    }, [target_id]);


    useEffect(() => {
        if (socket.connected && userId) {
            console.log("Emit add user")
            socket.emit("addUser", {
                'userId': userId
            });
            socket.on("newMessage", handleNewMessage);
            socket.on("accepted", handleAcceptCall)
            socket.off("rejected", handleRejectCall)
        }
        return () => {
            socket.off("accepted", handleAcceptCall)
            socket.off("rejected", handleRejectCall)
            socket.off("newMessage", handleNewMessage);
        }
    }, [socket.connected, userId]);

    const handleAcceptCall = () => {
        setCalling(false);
        window.open(`http://localhost:3000/dating/room/${id.current}`, 'Video Call', 'width=500,height=500,toolbar=1,resizable=1');
    }
    const handleRejectCall = () => {
        setCalling(false);
    }
    const handleCall = () => {
        id.current = chance.guid();
        socket.emit("call-request", {
            fullName: profile.fullName,
            roomId: id,
            fromUID: profile.userId, 
            toUID: target_id
        })
        
    }

    const handleNewMessage = (arrivalMessage) => {
        const ids = [userId, target_id]
        console.log("New messsage: ", arrivalMessage)
        if (arrivalMessage && ids.indexOf(arrivalMessage.senderId) !== -1 && ids.indexOf(arrivalMessage.recipientId) !== -1)
            setMessages((prev) => [...prev, arrivalMessage]);
    };

    const infiniteLoadMessage = useCallback(() => {
        setInfiniteLoading(true);
        console.log("Infinite loading!")
        messageAPI.get(target_id, currentMessagePage.current)
            .then(res => {
                console.log("Message: ", res)
                if (res.messages) {
                    if (currentMessagePage.current == 0) {
                        console.log('Get new message: ', res.messages.length)
                        setMessages(() => [...res.messages])
                        setTimeout(() => {
                            scrollToBottom()
                        }, 500);
                    }
                    else {
                        setMessages(prevMessages => [...prevMessages, ...res.messages])
                    }
                    currentMessagePage.current += 1;
                }
                setTimeout(() => {
                    setInfiniteLoading(false)
                }, 500);
            })
            .catch(err => {
                console.log(err)
                if (err.response.status == 401) { // Unauthorized
                    navigate('/')
                }
                setTimeout(() => {
                    setInfiniteLoading(false)
                }, 500);
            })
    }, [target_id])

    const messageChanging = (event) => {
        setTypingMessage(() => event.target.value)
    }
    const onEmojiClick = (event, emojiObject) => {
        setTypingMessage((oldMessage) => oldMessage + emojiObject.emoji);
    }

    const handleEmojiButton = (event) => {
        event.preventDefault();
        setChoosingEmoji((oldState) => !oldState);
    }
    const handleSubmitButton = async (event) => {
        event.preventDefault();
        const message = {
            senderId: userId,
            recipientId: target_id,
            messageBody: typingMessage
        };
        console.log("send message: ", message)
        try {
            const res = await messageAPI.create(message);
            setTypingMessage("");
        } catch (err) {
            if (err.response.status == 401) {
                navigate('/')
            }
            console.log(err);
        }
    };


    const handleCardClick = useCallback((event) => {

        const rect = event.target.getBoundingClientRect()
        const direction = (event.clientX - rect.left - rect.width / 2) > 0 ? 1 : -1;
        const newIdx = currentImg + direction;
        if (newIdx >= 0 && newIdx < targetUser.photos?.length) {
            setCurrentImg(newIdx);
        }
    }, [])


    const handleCancelCall = () => {
        setCalling(false);
        socket.emit("cancel-call", {
            fromUID: profile.userId, 
            toUID: target_id
        })
    }
    return (
        <Container className="chatting" fluid={true}>
            <CallingModal show = {calling} onHide = {handleCancelCall} />
            <Row>
                <Col className="box" sm={12} md={12} lg={7}>
                    <div className="box-header">
                        <div className="header-info">
                            <Avatar is_private={false} img_url={targetUser.photos ? targetUser.photos[0] : ""} style={{
                                width: "50px",
                                height: "50px",
                                border: "5px solid white"
                            }} />
                            <h3>{`You matched with ${targetUser.fullName} on 12/21/2021`}</h3>
                        </div>
                        <Videocam style={{
                            cursor: 'pointer',
                            margin: '0px 5px'
                        }} className="call-button" variant="contained" onClick={handleCall}>
                        </Videocam>
                        <Link className="header-action" to="/dating" onClick={() => setChatting(false)}>
                            <CloseIcon style={{
                                width: "24px",
                                height: "24px"
                            }} />
                        </Link>
                    </div>
                    <div className='box-body' ref={messageBox}>
                        <LoadingSpinner isShow={infiniteLoading} />
                        {
                            messages.map((message, idx) => (
                                <Message key={idx} content={message.messageBody} isMine={message.senderId == userId} />
                            ))
                        }
                    </div>
                    <div className="box-footer">
                        <form>
                            <textarea className="message" placeholder="Type a message" maxLength={3000} name="" id="" cols="30" value={typingMessage} onChange={messageChanging}></textarea>
                            <div className="action">
                                <button className="emoji-button" onClick={handleEmojiButton} style={{
                                    border: choosingEmoji ? "2px solid #f8a81f" : "none"
                                }}>
                                    <svg class="Sq(40px) My(8px)" viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true" role="presentation"><g fill="none" fill-rule="nonzero"><circle cx="10" cy="10" r="10" transform="translate(2 2)" fill="#f0f2f4"></circle><path d="M12 15.3c1.398 0 2.58-.876 3.066-2.1H8.934A3.298 3.298 0 0012 15.3m-2.1-3.9a.9.9 0 100-1.8.9.9 0 000 1.8m4.2 0a.9.9 0 100-1.8.9.9 0 000 1.8M12 16.8a4.8 4.8 0 110-9.6 4.8 4.8 0 010 9.6M12 6a6 6 0 100 12 6 6 0 000-12z" fill="#f8a81f"></path></g></svg>
                                </button>
                                <button type="submit" className="submit" onClick={handleSubmitButton}>SEND</button>
                            </div>
                            <div className="emoji-window" style={{
                                display: choosingEmoji ? "block" : "none"
                            }}>
                                <Picker disableSearchBar={true} onEmojiClick={onEmojiClick} pickerStyle={{ width: '100%' }} />
                            </div>
                        </form>
                    </div>
                </Col>
                <Col className="profile-col" sm={0} md={0} lg={5}>
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
                                targetUser.photos?.map((value, idx) => <div className="img-indicator" style={{
                                    width: "100%",
                                    height: "6px",
                                    borderRadius: "5px",
                                    backgroundColor: (idx === currentImg) ? "white" : "rgba(0, 0, 0, 0.2)",
                                }} key={idx} />)
                            }

                        </div>

                        <div className="card-img">
                            <Card.Img variant="top" style={{
                                backgroundImage: `linear-gradient(to top, rgb(0, 0, 0), rgb(0, 0, 0, 0.3), transparent, transparent), url('${targetUser.photos ? targetUser.photos[currentImg] : ""}')`,
                                backgroundPosition: '50% 0%',
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                            }} />
                            {targetUser.photos?.length > 1 && <div className="card-indicator">
                                <svg className="indicator indicator-left" viewBox="0 0 24 24" aria-hidden="false" role="img"><path className="" d="M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z"></path><title id="bb01635153c894db">Back</title></svg>
                                <svg className="indicator indicator-right" viewBox="0 0 24 24" aria-hidden="false" role="img"><path className="" d="M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z"></path><title id="feade9b75cd98b3d">Next</title></svg>
                            </div>}
                        </div>

                        <Card.Body>
                            <Card.Title>
                                <span className="age disable-select">{currentYear - new Date(targetUser.dateOfBirth).getFullYear()}</span>
                                <span className="name disable-select">{targetUser.fullName}</span>
                            </Card.Title>
                            <Card.Text className="disable-select">
                                <svg className="Va(m) Sq(16px)" viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true" role="presentation"><g transform="translate(2 5)" stroke="#fff" strokeWidth=".936" fill="none" fillRule="evenodd"><rect x="5.006" y="3.489" width="9.988" height="9.637" rx=".936"></rect><path d="M7.15 3.434h5.7V1.452a.728.728 0 0 0-.724-.732H7.874a.737.737 0 0 0-.725.732v1.982z"></path><rect x=".72" y="3.489" width="18.56" height="9.637" rx=".936"></rect></g></svg>
                                <span className="disable-select">{targetUser.work}</span>
                            </Card.Text>
                            <Card.Text className="disable-select">
                                <svg className="Va(m) Sq(16px)" viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true" role="presentation"><g stroke="#fff" strokeWidth=".936" fill="none" fillRule="evenodd"><path d="M19.695 9.518H4.427V21.15h15.268V9.52zM3.109 9.482h17.933L12.06 3.709 3.11 9.482z"></path><path d="M9.518 21.15h5.086v-6.632H9.518z"></path></g></svg>
                                <span className="disable-select">Lives in {targetUser.address}</span>
                            </Card.Text>
                            <Card.Text>
                                {targetUser.bio}
                            </Card.Text>
                            <Card.Footer>
                                <ButtonGroup>
                                    <Button className='card-btn'>UNMATCH</Button>
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

