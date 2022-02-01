import React, { memo, useEffect, useRef, useState } from 'react'
import { ButtonGroup, Card } from 'react-bootstrap'
import "./ProfileCard.scss"
import { Frame, useMotionValue, useTransform, useAnimation } from "framer";
import Button from '@restart/ui/esm/Button';
import { gsap } from "gsap";
import evaluateAPI from '../../api/evaluateAPI';
  

const currentYear = new Date().getFullYear()
const ProfileCard = (props) => {

    const cardElem = useRef(null)
    const tagNope = useRef(null)
    const tagLiked = useRef(null)
    const tlLeft = useRef(null); // Gsap timeline for swipe left
    const tlRight = useRef(null); // Gsap timeline for swipe right

    const [currentImg, setCurrentImg] = useState(0);
    // To move the card as the user drags the cursor
    const motionValue = useMotionValue(0);
    const [constrained, setConstrained] = useState(true)

    
    const [direction, setDirection] = useState()
    const [velocity, setVelocity] = useState()
    // To rotate the card as the card moves on drag
    const rotateValue = useTransform(motionValue, [-200, 200], [-20, 20]);
    
    // To decrease opacity of the card when swiped
    // on dragging card to left(-200) or right(200)
    // opacity gradually changes to 0
    // and when the card is in center opacity = 1
    const opacityValue = useTransform(
        motionValue,
        [-300, -150, 0, 150, 300],
        [0, 1, 1, 1, 0]
    );
    
    // Framer animation hook
    const animControls = useAnimation();
    
     	// determine direction of swipe based on velocity
    const getDirection = () => {
        return velocity >= 1 ? "right" : velocity <= -1 ? "left" : undefined
    }

    const getTrajectory = () => {
        setVelocity(motionValue.getVelocity())
        setDirection(getDirection())
    }

    const getVote = (childNode, parentNode) => {
        const childRect = childNode.getBoundingClientRect()
        const parentRect = parentNode.getBoundingClientRect()
        let result =
          parentRect.left >= childRect.right
            ? false
            : parentRect.right <= childRect.left
            ? true
            : undefined
        return result
      }
    
    const flyAwayDistance = (direction) => {
        const parentWidth = cardElem.current.parentNode.getBoundingClientRect().width
        const childWidth = cardElem.current.getBoundingClientRect().width
        return direction === "left"
            ? -parentWidth / 2 - childWidth
            : parentWidth / 2  + childWidth
    }

    async function flyAway(min){
        if (direction && Math.abs(velocity) > min) {
            setConstrained(false)
            await animControls.start({
                x: flyAwayDistance(direction)
            })
            await handleResult(props.profile.userId, direction == 'right')
           
        }
    }
    const handleResult = async (target_id, is_liked) =>{
        try {
            const res = await evaluateAPI.vote(target_id, is_liked);
            if(res.matched === true){

            }
            props.removeProfile(target_id)    
        } catch (error) {
            console.log('Something went wrong when swipe others profile')
        }
        
    }

    // useEffect(()=>{
    //     const childNode = cardElem.current
    //     const parentNode = cardElem.current.parentNode
    //     const result = getVote(childNode, parentNode)
    //     result !== undefined && handleResult(result);
    // }, [motionValue])
    
    useEffect(() => {
        tlRight.current = gsap.timeline({paused: true})
        .to(tagLiked.current, {
          opacity:1
        })
        .to(cardElem.current, {
          x: flyAwayDistance('right'),
          opacity: 0,
          rotate: 30
        })

        tlLeft.current = gsap.timeline({paused: true})
        .to(tagNope.current, {
            opacity:1
        })
        .to(cardElem.current, {
          x: flyAwayDistance('left'),
          opacity: 0,
          rotate: -30
        })

    }, [])
    
    async function handleCardBtn(event, is_liked){
        if(is_liked)
            await tlRight.current.play();
        else
            await tlLeft.current.play();
        await handleResult(props.profile.userId, is_liked);
    }
    const handleCardClick = (event)=>{

        const rect = event.target.getBoundingClientRect()
        const direction = (event.clientX- rect.left - rect.width/2) > 0 ? 1 : -1;
        const newIdx = currentImg  + direction;
        if(newIdx >= 0 && newIdx < props.profile.photos.length){
            setCurrentImg(newIdx);
        }
    }
    return(
        <Frame
            center
            onClick={handleCardClick}
            // Card can be drag only on x-axis
            animate={animControls}
            drag="x"
            x={motionValue}
            rotate={rotateValue}
            opacity={opacityValue}
            ref={cardElem}
            whileTap={{ scale: 1.1 }}
            dragConstraints={constrained && { left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={1}
            onDrag={getTrajectory}
            onDragEnd={() => flyAway(500)}
            className = "card-frame disable-select"
            
        >
            <Card className="disable-select" style={{
                backgroundImage: `linear-gradient(to top, rgb(0, 0, 0), rgb(0, 0, 0, 0.3), transparent, transparent), url('${props.profile.photos? props.profile.photos[currentImg]: ""}')`,
                backgroundPosition: '50% 0%',
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                
            }}>
                <div className="img-indicator" style={{
                    position: "absolute",
                    top: "5px",
                    left: "5px",
                    width: "calc(100% - 10px)",
                    height: "6px",
                    display: "flex",
                    gap: "5px",
                }}>
                    {
                     props.profile.photos.map((value, idx) => <div className="img-indicator" style={{
                            width: "100%",
                            height: "6px",
                            borderRadius:"5px",
                            backgroundColor:(idx === currentImg)? "white" : "rgba(0, 0, 0, 0.2)",
                        }} key={idx} />)
                    }
                    
                </div>
                <div ref={tagNope} className = "card-tag card-tag-nope"><span>NOPE</span></div>
                <div ref={tagLiked} className = "card-tag card-tag-liked"><span>LIKED</span></div>
                {props.profile.photos.length > 1 && <div className = "card-indicator">
                    <svg className="indicator indicator-left" viewBox="0 0 24 24"  aria-hidden="false" role="img"><path className="" d="M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z"></path><title id="bb01635153c894db">Back</title></svg>
                    <svg className="indicator indicator-right" viewBox="0 0 24 24"  aria-hidden="false" role="img"><path className="" d="M13.98 20.717a1.79 1.79 0 0 0 2.685 0 1.79 1.79 0 0 0 0-2.684l-7.158-6.62 7.158-6.8a1.79 1.79 0 0 0 0-2.684 1.79 1.79 0 0 0-2.684 0L5.929 9.98a1.79 1.79 0 0 0 0 2.684l8.052 8.052z"></path><title id="feade9b75cd98b3d">Next</title></svg>
                </div>}
                <Card.Body>
                <Card.Title>
                    <span className="name disable-select">{props.profile.fullName}</span>
                    <span className="age disable-select">{currentYear - new Date(props.profile.dateOfBirth).getFullYear()}</span>
                </Card.Title>
                {/* <Card.Text className = "disable-select">
                    <svg className="Va(m) Sq(16px)" viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true" role="presentation"><g transform="translate(2 5)" stroke="#fff" strokeWidth=".936" fill="none" fillRule="evenodd"><rect x="5.006" y="3.489" width="9.988" height="9.637" rx=".936"></rect><path d="M7.15 3.434h5.7V1.452a.728.728 0 0 0-.724-.732H7.874a.737.737 0 0 0-.725.732v1.982z"></path><rect x=".72" y="3.489" width="18.56" height="9.637" rx=".936"></rect></g></svg>
                    <span className = "disable-select">{props.job || ""}</span>
                </Card.Text> */}
                {/* <Card.Text className = "disable-select">
                    <svg className="Va(m) Sq(16px)" viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true" role="presentation"><g stroke="#fff" strokeWidth=".936" fill="none" fillRule="evenodd"><path d="M19.695 9.518H4.427V21.15h15.268V9.52zM3.109 9.482h17.933L12.06 3.709 3.11 9.482z"></path><path d="M9.518 21.15h5.086v-6.632H9.518z"></path></g></svg>
                    <span className = "disable-select">Lives in {props.address || ""}</span>
                </Card.Text> */}
                {/* <Card.Text className = "disable-select">
                    <svg className="Va(m) Sq(16px)" viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true" role="presentation"><g fill="#fff" stroke="#fff" strokeWidth=".5" fillRule="evenodd"><path d="M11.436 21.17l-.185-.165a35.36 35.36 0 0 1-3.615-3.801C5.222 14.244 4 11.658 4 9.524 4 5.305 7.267 2 11.436 2c4.168 0 7.437 3.305 7.437 7.524 0 4.903-6.953 11.214-7.237 11.48l-.2.167zm0-18.683c-3.869 0-6.9 3.091-6.9 7.037 0 4.401 5.771 9.927 6.897 10.972 1.12-1.054 6.902-6.694 6.902-10.95.001-3.968-3.03-7.059-6.9-7.059h.001z"></path><path d="M11.445 12.5a2.945 2.945 0 0 1-2.721-1.855 3.04 3.04 0 0 1 .641-3.269 2.905 2.905 0 0 1 3.213-.645 3.003 3.003 0 0 1 1.813 2.776c-.006 1.653-1.322 2.991-2.946 2.993zm0-5.544c-1.378 0-2.496 1.139-2.498 2.542 0 1.404 1.115 2.544 2.495 2.546a2.52 2.52 0 0 0 2.502-2.535 2.527 2.527 0 0 0-2.499-2.545v-.008z"></path></g></svg>
                    <span className = "disable-select">{props.distance} kilometers away</span>
                </Card.Text> */}
                <Card.Text>
                    {props.bio}
                </Card.Text>
                <Card.Footer>
                    <ButtonGroup>
                        <Button onClick={(e) => handleCardBtn(e, false)} className='card-btn card-btn-reject'>Left</Button>
                        <Button onClick={(e) => handleCardBtn(e, true)} className='card-btn card-btn-vote'>Right</Button>
                    </ButtonGroup>
                </Card.Footer>
                </Card.Body>
            </Card>
        </Frame>
        
    )
};
export default memo(ProfileCard);
