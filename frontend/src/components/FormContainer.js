import React from "react";
import { Container, Row, Col } from "react-bootstrap";
const FormContainer = ({ children }) => {
  return (
    <>
      <Container>
        <div className="justify-content-md-center">
          <Row>
            <Col>{children}</Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default FormContainer;
