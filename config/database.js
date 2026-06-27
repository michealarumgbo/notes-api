import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config;

// extract connection string
const connectURI = process.env.MONGOOSE_URI;

// define an asynchronous function to connect to database
export const connectDB = async () => {
  // initiate connection and return status
  try {
    await mongoose.connect(connectURI);
    console.log("DB Connection Successfull");
  } catch (error) {
    console.log("DB Connection Error: " + Error);
  }
};
