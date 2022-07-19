import path from "path";
import express from "express";
import dotenv from "dotenv";

import morgan from "morgan";
// bring in error handling middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
//routes
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
// bring in dotenv
dotenv.config();
// connect to the DB
connectDB();
//  init express to app
const app = express();
// running morgan
//TODO remove from prd app
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// allow json data
app.use(express.json());
//mount routers
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
//paypal config route
// when ready to make payment hit this and get the client id
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);
//
// __dirname points to current dir, but not avalable in ES modules ,only avalable in common js
// so to mimic this create a var called __dirname and path.resolve
const __dirname = path.resolve();
//Make uploads a static folder so it can be loaded in the browser
// need path module in to do this
// point to uploads folder
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}
// bring in the error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// kick off server
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
