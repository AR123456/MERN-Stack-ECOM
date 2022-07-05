// need path module from express to make static folder
import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import connectDB from "./config/db.js";
// routes
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
// upload routes
import uploadRoutes from "./routes/uploadRoutes.js";
// bring in error handling middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
// bring in dotenv
dotenv.config();
// connect to the DB
connectDB();
//  init express to app
const app = express();
// running morgan
//TODO remove from prd app
app.use(morgan("combined"));
// allow json data
app.use(express.json());
// home route
app.get("/", (req, res) => {
  res.send("API is running.... ");
});
//mount routers
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
//paypal config route
// when ready to make payment hit this and get the client ik
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);
//
// __dirname points to current dir, but not avalible in ES modules ,only avalible in common js
// so to mimic this create a var called __durname and path.resolve
const __dirname = path.resolve();
//Make uploads a static folder so it can be loaded in the browser
// be sure to bring path module in to do this
// point to uploads folder

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// bring in the error handling middleware
app.use(notFound);
app.use(errorHandler);

// get the port out of the .env file or use 5000
const PORT = process.env.PORT || 5000;

// kick off server
app.listen(
  5000,
  console.log(
    // adding some color to console .log
    `Server is running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
      .magenta.bold
  )
);
