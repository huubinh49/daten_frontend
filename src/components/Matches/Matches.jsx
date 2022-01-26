import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ChattingContext } from '../../pages/DatingApp/DatingContext';
import "./Matches.scss";
const MatchCard = memo((props) => {
    return(
        
        <div style={{
            width: "100%",
            height: "140px",
            borderRadius: "5px",
            backgroundImage: `linear-gradient(to top, rgb(0, 0, 0), rgb(0, 0, 0, 0.3), transparent, transparent), url('${props.img_urls[0]}')`,
            backgroundPosition: '50% 0%',
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            display: "flex",
            alignItems: "flex-end",
            padding: "10px"
        }}>
            <span style={{
                fontSize: "1em",
                fontWeight: "bold",
                color: "white"
            }}>{props.name}</span>
        </div>
        
    )
})

function Matches(props) {
    const matchRef = useRef(null);
    const [chatting, setChatting] = useContext(ChattingContext);
    const [profiles, setProfiles] = useState([])
    // TODO: get more user already matched
    const loadMore = () => {
        const newProfiles = []// ...
        setProfiles(prevProfiles =>(
            [
                ...prevProfiles,
                ...newProfiles    
            ]
        ))
    };

    useEffect(() => {
        const margin = 1; 
        const scrollHandler = (event) => {
            if (
              matchRef.current.scrollTop + matchRef.current.clientHeight + margin  >= matchRef.current.scrollHeight
            ) {
              loadMore();
            }
        }
        matchRef.current.addEventListener("scroll",scrollHandler );

        const newProfiles = []// ... Load 10 first profiles
        setProfiles(newProfiles)
        return () => {
            if(matchRef.current)
            matchRef.current.removeEventListener("scroll", scrollHandler)
        }
       
    }, [])
    return(
        <div className="matches" ref={matchRef} style={{
            overflowY: "scroll"
        }}>
            <Container>
                <Row >
                    {profiles.map((profile, idx) => <Col style={{
                        padding: "8px"
                    }} md={6} lg={4}>
                        <Link to={`/dating/messages/${props.user_id}`} onClick={() => setChatting(true)} >
                            <MatchCard {...profile} />
                        </Link>
                    </Col>)}
                </Row>
            </Container>
        </div>
    )
};
export default memo(Matches)