import express from "express";
const router = express.Router();
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
// middle ware to validate token
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser).get(protect, admin, getUsers);

router.post("/login", authUser);
// if we are getting put make it protected and pass in the
// updateUserProfile controller
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
// route for admin to delete a user
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
