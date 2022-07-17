import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";
// deconstruct props history when submitting the form want
// to  redirect or push to payment screen
const ShippingScreen = ({ history }) => {
  // fill const with state stuff
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  // state from forms - if in local storage fill this stuff in
  const [street, setStreet] = useState(shippingAddress.street);
  const [city, setCity] = useState(shippingAddress.city);
  const [state, setState] = useState(shippingAddress.state);
  const [zip, setZip] = useState(shippingAddress.zip);
  const [country, setCountry] = useState(shippingAddress.country);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    //TODO dispatch save shipping address to user db
    e.preventDefault();
    // dispatch the form data
    dispatch(saveShippingAddress({ street, city, state, zip, country }));
    // then move to the next page
    history.push("/payment");
  };

  return (
    <FormContainer>
      {/* pass in step we are on and every step before the step we are on  */}
      {/* This is shipping screen so step 1 and 2  */}
      {/* TODO this should really be just the step we are on ? */}
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Street Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Street address"
            value={street}
            // html5 form validation
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
            required
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
