// this file will not be connected to server so bring in dependencies this
import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";
// not connected to server so need to pull in
dotenv.config();

connectDB();
// function to import data and function to destroy data async so put in that with try catch
const importData = async () => {
  // first clear all the collections out completely
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    // now import seeder file and set to const
    // is connection between products & users want admin user to be the ObjectId (productSchema) for all products createdUsers will be an array
    const createdUsers = await User.insertMany(users);
    // get the adminUser out to the array
    const adminUser = createdUsers[0]._id;
    // pull in products, map through the products and add admin user to each one
    const sampleProducts = products.map((product) => {
      // for each product return an object with all the stuff that is in the product already and add the admin user
      return { ...product, user: adminUser };
    });
    //  now add the products to the DB
    await Product.insertMany(sampleProducts);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    // if something goes wrong log the error
    console.error(`${error}`.red.inverse);
    // exit the process with error
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}

// to run node backend/seeder -d
// then node backend/seeder
// or use the scripts  npm run data:destroy
// npm run data:import
