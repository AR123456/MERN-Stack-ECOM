import mongoose from "mongoose";
import bcrypt from "bcryptjs";
// TODO add user billing or primary shipping address updated from order being placed
// may be ref from order
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    //TODO  adding shipping address to the user model wwhen an order is placed
    // adding here with same name, shipping address.  ? call primaryShippingAddress - any need to?
    shippingAddress: {
      street: { type: String, required: false },
      city: { type: String, required: false },
      state: { type: String, required: false },
      zip: { type: String, required: false },
      country: { type: String, required: false },
    },
  },
  {
    timestamps: true,
  }
);
//TODO looking at sendgrid to do passwrod resets
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
