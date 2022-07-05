import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../actions/cartActions";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
// deconstruct props history when submitting the form want
// to  redirect or push to payment screen
const ShippingScreen = ({ history }) => {
  // fill const with state stuff
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  // state from forms - if in local storage fill this stuff in
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [USState, setUSState] = useState(shippingAddress.USState);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  // set up dispatch
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    //TODO dispatch save shipping address to user db
    e.preventDefault();
    // dispatch the form data
    dispatch(
      saveShippingAddress({ address, city, USState, postalCode, country })
    );
    // then move to the next page
    history.push("/payment");
  };
  return (
    <FormContainer>
      {/* pass in step we are on and every step before the step we are on  */}
      {/* This is shipping screen so step 1 and 2  */}
      {/* TODO this should really be just the step we are on ? */}

      <CheckoutSteps step2 step3></CheckoutSteps>
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Address"
            value={address}
            // html5 form validation
            required
            onChange={(e) => setAddress(e.target.value)}
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
        {/* TODO I added US State in address  */}
        <Form.Group controlId="USstate">
          <Form.Label>State</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter State"
            value={USState}
            // html5 form validation
            required
            onChange={(e) => setUSState(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="postalCode">
          <Form.Label>Zip Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Zip Code"
            value={postalCode}
            // html5 form validation
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Country"
            value={country}
            // html5 form validation
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Continue to payment
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
