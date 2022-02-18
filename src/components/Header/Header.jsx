import React, { memo, useEffect, useRef } from 'react';
import { Container, Image, Nav, Navbar } from 'react-bootstrap';
import logo from "../../logo.svg";
import "./Header.scss"

function Header(props){

    const headerRef = useRef(null)
    useEffect(() => {
        const stickyHeader = ()=>{
            if (window.pageYOffset > 80) {
                headerRef.current.classList.add("sticky");
              } else {
                headerRef.current.classList.remove("sticky");
              }
        }
        window.onscroll = () => stickyHeader();
        return () => {
            window.onscroll = () => {};
        }
    }, [])
    return(
        <header ref={headerRef}>
                <Navbar bg="light" expand="md">
                    <Container >
                        <Navbar.Brand href="/#home">
                            <Image src={logo} fluid  style ={{
                            width: "52px",
                            height: "52px"
                        }}/>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/dating">Dating</Nav.Link>
                                <Nav.Link href="/#home">Home</Nav.Link>
                                <Nav.Link href="/#features">Features</Nav.Link>
                                <Nav.Link href="/#story">Story</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
        </header>
    )
}
export default memo(Header)