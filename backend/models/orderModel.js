import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    // user associated with this order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // referance the user model
      ref: "User",
    },
    // array of order items with stuff related to the order
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        // order has relationship to product
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    shippingAddress: {
      // many imbedded objects
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    // scalable payment Methods

    paymentMethod: {
      type: String,
      required: true,
    },
    // TODO updating to tyr to resolve 500 error this is data coming back from paypal
    // paymentResult: {
    //   type: String,
    //   status: String,
    //   update_time: String,
    //   // the email coming from pay pal
    //   email_address: String,
    // },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    // date and time paid at
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    // created at updated at fields can be created automatically this way
    timestamps: true,
  }
);
// create a model from this schema
const Order = mongoose.model("Order", orderSchema);
// export
export default Order;
