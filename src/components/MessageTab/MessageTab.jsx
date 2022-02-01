import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { load } from 'react-cookies';
import { Link } from 'react-router-dom';
import { ChattingContext } from '../../pages/DatingApp/DatingContext';
import matchAPI from '../../api/matchAPI';
import "./MessageTab.scss"

const Avatar = memo((props) => (
    <div className= "card-avatar" style={{
        backgroundImage: (props.is_private)? '':`url('${props.img_url}')` ,
        backgroundColor: "#000000",
        backgroundPosition: '50% 50%',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        borderRadius: "50%",
        minWidth: props.style.width,
        minHeight: props.style.height,
        ...props.style
    }} />
))

const MessageTile = memo((props) =>{
    return(
            <div className="card" style={{
                display: "flex",
                flexFlow: "row",
                padding: "10px 0px"
            }}>
                <Avatar is_private={props.is_private} img_url={props.photos[0]} style={{
                    width:"50px",
                    height:"50px",
                    margin: "0px 20px"
                }}/>

                <div className="card-content" style={{
                    display: "flex",
                    height: "100%",
                    flexFlow: "column",
                    justifyContent: "center"

                }}>
                    <span className="card-name" style={{fontSize: "1em"}}>{props.name}</span>
                    <span className="card-message" style={{fontSize: "0.8em", color: "gray"}}>{props.newest_message}</span>
                </div>
            </div>
    )
})
const MessageTab = memo((props) => {
    const [messages, setMessages] = useState([])
    const messageRef = useRef(null);
    const [chatting, setChatting] = useContext(ChattingContext);
    
    const loadMore = async () => {
        const user_id = sessionStorage.getItem('user_id');
        const res = await matchAPI.getAllChatted(user_id)
        const newMessages = res.messages
        setMessages(prevMessages =>(
            [
                ...prevMessages,
                ...newMessages    
            ]
        ))
    };

    useEffect(() => {
        const margin = 1; 
        const scrollHandler = (event) => {
            if (
              messageRef.current.scrollTop + messageRef.current.clientHeight + margin  >= messageRef.current.scrollHeight
            ) {
              loadMore();
            }
        }
        messageRef.current.addEventListener("scroll",scrollHandler );
        loadMore();
        return () => {
            if(messageRef.current)
            messageRef.current.removeEventListener("scroll",scrollHandler );
        }
    }, [])
    return(
        <div className="message" ref={messageRef} style={{
            overflowY: "scroll"
        }}>
            <Container>
                <Row >
                    {messages.map((message, idx) => <Col sm={12} style={{padding: "0px"}}>
                        <Link to={`/dating/messages/${message.user_id}`} onClick={() => {
                            setChatting(true)
                        }} >
                            <MessageTile {...message} key ={idx} is_private = {props.is_private}/>
                        </Link>
                    </Col>)}
                </Row>
            </Container>
        </div>
    )
});

export {Avatar, MessageTab}