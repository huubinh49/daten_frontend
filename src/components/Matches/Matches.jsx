import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ChattingContext } from '../../pages/DatingApp/DatingContext';
import matchAPI from '../../api/matchAPI';
import "./Matches.scss";
import { SocketContext } from '../../communicate/socket';
import { useUserID } from '../../hooks/auth';
import { useNavigate } from 'react-router';
const MatchCard = memo((props) => {
    return(
        
        <div style={{
            width: "100%",
            height: "140px",
            borderRadius: "5px",
            backgroundImage: `linear-gradient(to top, rgb(0, 0, 0), rgb(0, 0, 0, 0.3), transparent, transparent), url('${props.photos[0]}')`,
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
            }}>{props.fullName}</span>
        </div>
        
    )
})

function Matches(props) {
    const matchRef = useRef(null);
    const socket = useContext(SocketContext);
    const [chatting, setChatting] = useContext(ChattingContext);
    const [profiles, setProfiles] = useState([])
    const [userId, setUserId] = useUserID();
    const navigate = useNavigate();
    // get more user already matched
    const loadMore = async ()  => {
        try{
            const res = await matchAPI.getAll(userId)
            const newProfiles = res.matches
            setProfiles(prevProfiles =>(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                [
                    ...prevProfiles,
                    ...newProfiles    
                ]
            ))
        }catch(error){
            if(error.response.status === 401)
            navigate('/');
        }
        
    };
    const handleNewMatch = (matcher) => {
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
        return () => {
            if(matchRef.current)
            matchRef.current.removeEventListener("scroll", scrollHandler)
        }
       
    }, [])
    useEffect(() => {
        if(socket.connected){
            socket.emit("addUser", {
                'userId': userId
                });
            socket.on("newMatch", handleNewMatch);
        }
        return () => {
            socket.off("newMatch", handleNewMatch);
        }
    }, [socket.connected])
    
    return(
        <div className="matches" ref={matchRef} style={{
            overflowY: "scroll"
        }}>
            <Container>
                <Row >
                    {profiles && profiles.map((profile, idx) => <Col style={{
                        padding: "8px"
                    }} md={6} lg={4}>
                        <Link key={idx} to={`/dating/messages/${profile.userId}`} onClick={() => setChatting(true)} >
                            <MatchCard {...profile} />
                        </Link>
                    </Col>)}
                </Row>
            </Container>
        </div>
    )
};
export default memo(Matches);