import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // TODO verify this, is this still needed ?
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    // adding some color to console .log
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // adding some color to console .log
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
