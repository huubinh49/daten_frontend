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
    
    const loadMore = () => {
        setProfiles(prevProfiles =>(
            [
                ...prevProfiles,
                ...Array(10).fill({
                'user_id': "111",
                'name': "Thu Suong",
                'age': "18",
                'job': "Student",
                'address': "Ho Chi Minh",
                'distance': '1',
                'img_urls': ["https://images-ssl.gotinder.com/u/fwGiTfufdrZAuK5Pv6D2R7/rhEotCTAKggGNqQcj85aD4.jpg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS9md0dpVGZ1ZmRyWkF1SzVQdjZEMlI3LyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2NDAyMDk2ODh9fX1dfQ__&Signature=wLCWp9mdVZt2YiXg-XRpYjBZKC8y~iTiZQXCZMKqomBx2tiVQwTmI1lulhYy99Q7nlscPDBhBPQKKGIWgw1dcTGXV-6WMgQmipcScn7pUQIu9P7lq~ugFP44YkndvdZDq4Mt44LKoTczHdD1N9b~UdmNCk9zOE6NS6udcWSgNhMGijiFVsL-jGeu4B2Hx-WxNKI4x-0mGF-jUK2T7bq8zSl-vFMKp~VJKh2y1lv4d~GCKKzkBO3P0Jj4xG7Y0EWF6C09l~xSebvyI6lpT8rul3bXzBUlJNEMsDlADYZ2VDeRijvG5VKclfrf85MP9J2myX5UB5zcc7OhmpWWG4151w__&Key-Pair-Id=K368TLDEUPA6OI"],
                'bio': "Ban bong can icon cac thu"
            })]
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
        setProfiles(Array(10).fill({
            'user_id': "111",
            'name': "Thu Suong",
            'age': "18",
            'job': "Student",
            'address': "Ho Chi Minh",
            'distance': '1',
            'img_urls': ["https://images-ssl.gotinder.com/u/fwGiTfufdrZAuK5Pv6D2R7/rhEotCTAKggGNqQcj85aD4.jpg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS9md0dpVGZ1ZmRyWkF1SzVQdjZEMlI3LyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2NDAyMDk2ODh9fX1dfQ__&Signature=wLCWp9mdVZt2YiXg-XRpYjBZKC8y~iTiZQXCZMKqomBx2tiVQwTmI1lulhYy99Q7nlscPDBhBPQKKGIWgw1dcTGXV-6WMgQmipcScn7pUQIu9P7lq~ugFP44YkndvdZDq4Mt44LKoTczHdD1N9b~UdmNCk9zOE6NS6udcWSgNhMGijiFVsL-jGeu4B2Hx-WxNKI4x-0mGF-jUK2T7bq8zSl-vFMKp~VJKh2y1lv4d~GCKKzkBO3P0Jj4xG7Y0EWF6C09l~xSebvyI6lpT8rul3bXzBUlJNEMsDlADYZ2VDeRijvG5VKclfrf85MP9J2myX5UB5zcc7OhmpWWG4151w__&Key-Pair-Id=K368TLDEUPA6OI"],
            'bio': "Ban bong can icon cac thu"
        }))
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