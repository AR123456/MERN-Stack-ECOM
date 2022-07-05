import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <Container>
        <Container>
          <Row>
            <Col className="text-center py-3">Copyright&copy; MERN ecomm</Col>
          </Row>
        </Container>
      </Container>
    </footer>
  );
};

export default Footer;
