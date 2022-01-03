import React, { memo } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

function Footer(props) {
    return(
        <footer style = {{
            margin: "auto 0"
        }}>
            <Container fluid style={{backgroundColor: "white", height: "50px"}}>
                <Row style={{
                    height: "100%"
                }}>
                    <Col style={{
                        
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <span> © 2021 by Daten. Created by Binh Nguyen.</span>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
};
export default memo(Footer);