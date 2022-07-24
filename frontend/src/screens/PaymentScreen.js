import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";

const PaymentScreen = ({ history }) => {
  // bringing in shipping address to be able to redirect
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress.street) {
    history.push("/shipping");
  }
  //   for now setting default to paypal
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();
  //TODO if user loggsout before clicking pay button but after entering address the admin can see it as undel and un paid
  // but when user logs back in the cart has been cleared so the can no longer see the order and pay for it
  // is there a way to get the unpaid from last time to show up in the cart?  or dont sent it to DB for admin to see?
  const submitHandler = (e) => {
    //TODO save to user db ?
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PayPal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            {/* stripe example so scaleable  */}
            {/* <Form.Check
              type='radio'
              label='Stripe'
              id='Stripe'
              name='paymentMethod'
              value='Stripe'
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check> */}
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
