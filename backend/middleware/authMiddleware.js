// validate the token add middleware were we want to protect the route
import jwt from "jsonwebtoken";
// use async express handler to handle errors
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  // init token
  let token;
  //will send this through headers in the
  //Authorization Key's value as a Bearer token
  //   console.log(req.headers.authorization);
  // put in check for Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // token found try to decode it
    try {
      //remove the word Bearer from the token
      token = req.headers.authorization.split(" ")[1];
      // pass in the token and secret to decode
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // get user id from token and use it to find and return all
      // the user data but dont send the password
      req.user = await User.findById(decoded.id).select("-password");
      //   console.log(req.user);
      next();
    } catch (error) {
      // token could not be decoded
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    // 401 is not authorized
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});
// middleware for admin users
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    //TODO this error message should not be this specific
    throw new Error("Not authorized as an admin");
  }
};
// use protect in userRoute
export { protect, admin };
