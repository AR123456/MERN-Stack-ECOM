import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {});
    // adding some color to console .log
    console.log(`MongoDB Connected ${conn.connection.host} `.cyan.underline);
  } catch (error) {
    // adding some color to console .log
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
