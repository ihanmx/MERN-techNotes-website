import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.DATABASE_URI;
    if (!uri) {
      //use if instead of !
      throw new Error("DATABASE_URI is not set in environment");
    }

    await mongoose.connect(uri);
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
