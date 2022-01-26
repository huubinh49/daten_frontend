import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useTargetUser from '../../hooks/targetUser';
import { ChattingContext } from '../../pages/DatingApp/DatingContext';
import "./Message.scss"

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

const MessageCard = memo((props) =>{
    return(
            <div className="card" style={{
                display: "flex",
                flexFlow: "row",
                padding: "10px 0px"
            }}>
                <Avatar is_private={props.is_private} img_url={props.img_urls[0]} style={{
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
const Message = memo((props) => {
    const [messages, setMessages] = useState([])
    const messageRef = useRef(null);
    const [chatting, setChatting] = useContext(ChattingContext);
    
    // TODO: Write get list user that already talked together
    const loadMore = () => {
        console.log("load more!")
        setMessages(prevMessages =>(
            [
                ...prevMessages,
                ...(new Array(10)).fill({
                    'user_id': "111",
                    "name": "Ngao",
                    "img_urls": ["https://images-ssl.gotinder.com/6006feada0848701004c7e72/172x216_153091d3-e4da-4501-8e22-8913b860dc24.jpg"],
                    "newest_message": "Anh kiem ra ham"
                })
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
// TODO: Write get list user that already talked together
        setMessages(
            new Array(10).fill({
                'user_id': "111",
                "name": "Ngao",
                "img_urls": ["https://images-ssl.gotinder.com/6006feada0848701004c7e72/172x216_153091d3-e4da-4501-8e22-8913b860dc24.jpg"],
                "newest_message": "Anh kiem ra ham"
            })
        )
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
                            <MessageCard {...message} key ={idx} is_private = {props.is_private}/>
                        </Link>
                    </Col>)}
                </Row>
            </Container>
        </div>
    )
});

export {Avatar, Message}