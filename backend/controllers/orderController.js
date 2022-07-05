import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

//@desc Create New order
//@route POST/api/orders
//@access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  console.log(req.body);

  // check orderItems and if empty send error back to front end
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    //  -instantiate a new order
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    // save the order to the DB
    //TODO where is validation that bad actor did not change
    // the prices or num of items or other malicous stuff
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

//@desc get order by ID
//@route GET/api/orders/:id
//@access Private
//TODO improve the security of this route by checking if admin or user sect58 Ch10 Q&A
const getOrderById = asyncHandler(async (req, res) => {
  // fetch the order - getting from URL - so params
  // also need the name and user info of the user placing the order .populate()
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  // check to see if order exits if not throw error.
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found ");
  }
});

//@desc update order to paid

//@route PUT/api/orders/:id/pay
//@access Private
//TODO improve the security of this route by checking if admin or user sect58 Ch10 Q&A
const updateOrderToPaid = asyncHandler(async (req, res) => {
  //getting from URL - so params
  const order = await Order.findById(req.params.id);
  // check to see if order exits if not throw error.
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // this will come from  from paypal payer object
    //TODO other payment API would be difrent
    // set properties
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    // const to save it in the DB -updated not update
    // const updateOrder = await order.save();
    // res.json(updateOrder);
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found ");
  }
});
//TODO functionality to change to acctually delivered when that happens ?
// maybe this should be shipped since that is what is actualy happening
//@desc update order to out for delivery
//@route GET/api/orders/:id/deliver
//@access Private/admin
//TODO improve the security of this route by checking if admin or user sect58 Ch10 Q&A
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  //getting from URL - so params
  const order = await Order.findById(req.params.id);
  // check to see if order exits if not throw error.
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    // send back updated order
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found ");
  }
});
//@desc Users order history
//@route GET/api/orders/myorders
//@access Private
//TODO improve the security of this route by checking if admin or user sect58 Ch10 Q&A
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

//@desc Admin view of all orders
//@route GET/api/orders
//@access Admin Private
const getOrders = asyncHandler(async (req, res) => {
  // return all the orders and use populate to get id and name of the
  // user associated with that order from user collection
  // TODO what about the person fullfilling the order, would that person also
  // need the address ect.
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
