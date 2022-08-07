import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";

const ShippingScreen = ({ history, data }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const primary = useSelector((state) => state.userLogin.userInfo);

  const [street, setStreet] = useState(() => {
    if (!shippingAddress.street) {
      return primary.primaryShippingStreet;
    } else {
      return shippingAddress.street;
    }
  });
  const [city, setCity] = useState(() => {
    if (!shippingAddress.city) {
      return primary.primaryShippingCity;
    } else {
      return shippingAddress.city;
    }
  });
  const [state, setState] = useState(() => {
    if (!shippingAddress.state) {
      return primary.primaryShippingState;
    } else {
      return shippingAddress.state;
    }
  });
  const [zip, setZip] = useState(() => {
    if (!shippingAddress.zip) {
      return primary.primaryShippingZip;
    } else {
      return shippingAddress.zip;
    }
  });
  const [country, setCountry] = useState(shippingAddress.country);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ street, city, state, zip, country }));

    history.push("/payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Street Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Street address"
            value={street}
            required
            onChange={(e) => setStreet(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            value={city}
            // html5 form validation
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="state">
          <Form.Label>State</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter state"
            value={state}
            // html5 form validation
            required
            onChange={(e) => setState(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="zip">
          <Form.Label>Zip Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter zip code"
            value={zip}
            required
            onChange={(e) => setZip(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
