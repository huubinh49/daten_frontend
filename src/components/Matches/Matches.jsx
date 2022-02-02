import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ChattingContext } from '../../pages/DatingApp/DatingContext';
import matchAPI from '../../api/matchAPI';
import "./Matches.scss";
import { SocketContext } from '../../socket/socket';
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
    const socket = useContext(SocketContext);
    const [chatting, setChatting] = useContext(ChattingContext);
    const [profiles, setProfiles] = useState([])
    // get more user already matched
    const loadMore = async ()  => {
        const user_id = localStorage.getItem('user_id');
        const res = await matchAPI.getAll(user_id)
        console.log('Matches query data: ', res)
        const newProfiles = res.matches
        setProfiles(prevProfiles =>(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
            [
                ...prevProfiles,
                ...newProfiles    
            ]
        ))
    };
    const handleNewMatcher = (matcher) => {
        setProfiles(prevProfiles =>(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
            [
                matcher,
                ...prevProfiles
            ]
        ))
    }
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
        loadMore();
        
        socket.on("newMatcher", handleNewMatcher);
        return () => {
            if(matchRef.current)
            matchRef.current.removeEventListener("scroll", scrollHandler)

            socket.off("newMatcher", handleNewMatcher);
        }
       
    }, [])
    return(
        <div className="matches" ref={matchRef} style={{
            overflowY: "scroll"
        }}>
            <Container>
                <Row >
                    {profiles && profiles.map((profile, idx) => <Col style={{
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
export default memo(Matches);