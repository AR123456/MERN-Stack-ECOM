import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { register } from "../actions/userActions";

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [primaryShippingStreet, setPrimaryShippingStreet] = useState("");
  const [primaryShippingCity, setPrimaryShippingCity] = useState("");
  const [primaryShippingState, setPrimaryShippingState] = useState("");
  const [primaryShippingZip, setPrimaryShippingZip] = useState("");

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);

  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(
        register(
          name,
          email,
          password,
          primaryShippingStreet,
          primaryShippingCity,
          primaryShippingState,
          primaryShippingZip
        )
      );
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>

      {message && <Message variant="danger">{message}</Message>}

      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="primaryStreet">
          <Form.Label>Primary Shipping Street</Form.Label>
          <Form.Control
            type="text"
            placeholder="Primary Street Address"
            value={primaryShippingStreet}
            onChange={(e) => setPrimaryShippingStreet(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {/*  */}
        <Form.Group controlId="primaryCity">
          <Form.Label>Primary Shipping City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Primary City Address"
            value={primaryShippingCity}
            onChange={(e) => setPrimaryShippingCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="primaryState">
          <Form.Label>Primary Shipping State</Form.Label>
          <Form.Control
            type="text"
            placeholder="Primary State Address"
            value={primaryShippingState}
            onChange={(e) => setPrimaryShippingState(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="primaryZip">
          <Form.Label>Primary Shipping Zip</Form.Label>
          <Form.Control
            type="text"
            placeholder="Primary Zip Code Address"
            value={primaryShippingZip}
            onChange={(e) => setPrimaryShippingZip(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Register
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Have an Account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
