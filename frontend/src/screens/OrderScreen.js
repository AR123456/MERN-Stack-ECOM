import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { Link } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
// importing the order pay reset directly from the consts
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";
// Note all of this is comming from the DB
//TODO why is order items 0?
//TODO lots of errors in the address had to reload page for this to work
//TODO refactor using methond from Q&A lec 60 part to store the item
//price in DB and pull from there
// need match to ___ f order id from _____
const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;
  // state for handling the sdk from paypal
  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  // bring in orderPay action
  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;
  // state for order paid
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;
  // need user info from state to only show button to admin
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  //TODO refactor using methond from Q&A lec 60 part to store the item- pull from db ?
  if (!loading) {
    //   Calculate prices
    //TODO look at using the Javascript Internationalzation API to format currency
    // funtion so we are showing in dollar format
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    // calculate prices - using redux reducer - which takes in a accumulater and item
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }
  // added from section 61
  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }
    // if user is not logged in redirect to login page
    //TODO this may be something to do on other pages to not show
    // them to people who should not see them
    const addPayPalScript = async () => {
      // get the client id from server
      const { data: clientId } = await axios.get("/api/config/paypal");
      // dynamically generate script tag
      const script = document.createElement("script");
      script.type = "text/javascript";
      // url from paypal
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      // needs to be asyncronis
      script.async = true;
      //piece of state for when the SDK is ready
      script.onload = () => {
        setSdkReady(true);
      };
      // add the script to the body
      document.body.appendChild(script);
    };

    if (!order || successPay || successDeliver || order._id !== orderId) {
      // stop the refreshing after already paid
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
      // if the order is not paid set the script to true
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
    // TODO from section 83 Mark as Del Q&A
    // why are history and userInfo not included in the useEffect, if add be sure to test
  }, [dispatch, orderId, successPay, successDeliver, order]);
  // paymentResult coming from paypal
  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              {/*  pulling user name from order to display here can do this because on back 
              end we joined useing .populate */}
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.street}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.state}
                {order.shippingAddress.zip}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {/* TODO is there a use case to add payment method to local storage ?  */}
                {/* TODO look at Q&A sect9, 55 tip on adding to local storage */}
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {/* show what is in order or that order is empty  */}
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    // for each order item do this and need an index
                    // TODO this should not be index but item.product see course notes section 9 Q&A pt55
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* adding check on order user so admin dosent have the paypal button when she is reviewing orders */}
              {!order.isPaid && order.user === userInfo._id && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
              {/* only admin can see this button and only if order paid and not del yet */}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
