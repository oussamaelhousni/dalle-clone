import mongoose from "mongoose";

const connectDB = async (url) => {
    mongoose.set("strictQuery", true);
    await mongoose.connect(url);
    console.log("connected to mongoDB");
};

export default connectDB;
