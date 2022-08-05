import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
//TODO s7, 43 re prd security

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  // destructue email and password from req.body
  const { email, password } = req.body;
  // find user attempting login
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      primaryShippingStreet: user.primaryShippingStreet,
      primaryShippingCity: user.primaryShippingCity,
      primaryShippingState: user.primaryShippingState,
      primaryShippingZip: user.primaryShippingZip,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    primaryShippingStreet,
    primaryShippingCity,
    primaryShippingState,
    primaryShippingZip,
  } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    // TODO 8,47 need to not give bad actor clues
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    primaryShippingStreet,
    primaryShippingCity,
    primaryShippingState,
    primaryShippingZip,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      primaryShippingStreet: user.primaryShippingStreet,
      primaryShippingCity: user.primaryShippingCity,
      primaryShippingState: user.primaryShippingState,
      primaryShippingZip: user.primaryShippingZip,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      //  for updating profile pull shipping in from db
      primaryShippingStreet: user.primaryShippingStreet,
      primaryShippingCity: user.primaryShippingCity,
      primaryShippingState: user.primaryShippingState,
      primaryShippingZip: user.primaryShippingZip,
    });
  } else {
    res.status(404);
    //TODO need to not give bad actor clues
    throw new Error("User not found");
  }
});

// @desc    Update user profile done by a user
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  // check for user
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    //the password here will be encrypted even if
    // the password changes because it is handled in model
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    // res similar to login
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      //TODO for updating user pull in edits to primary shipping
      primaryShippingStreet: updateUser.primaryShippingStreet,
      primaryShippingCity: updateUser.primaryShippingCity,
      primaryShippingState: updateUser.primaryShippingState,
      primaryShippingZip: updateUser.primaryShippingZip,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users by admin only
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID by admin only
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  // the id in the url  dont send the password back
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    // user.isAdmin = req.body.isAdmin;
    //TODO is this best way to solve ? QA 71
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      // TODO pull in primary shipping stuff
      // primaryShippingStreet: user.primaryShippingStreet,
      // primaryShippingCity: user.primaryShippingCity,
      // primaryShippingState: user.primaryShippingState,
      // primaryShippingZip: user.primaryShippingZip,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
