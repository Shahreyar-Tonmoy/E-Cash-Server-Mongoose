import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const getConnectionString = () => {
  const connectURI = process.env.DATABASE_LOCAL;

  if (!connectURI) {
    throw new Error("DATABASE_LOCAL environment variable is not defined.");
  }

  const uri = connectURI
    .replace("<username>", process.env.DB_USER || "")
    .replace("<password>", process.env.DB_PASS || "");

  return uri;
};

const connectDB = async () => {
  console.log("Connecting to the database....");

  try {
    const uri = getConnectionString();
    await mongoose.connect(uri, { dbName: process.env.DB_NAME });
    console.log("Connected to the database");
  } catch (error) {
    console.error("MONGODB connection failed!!!", error);
    process.exit(1);
  }
};

export default connectDB;