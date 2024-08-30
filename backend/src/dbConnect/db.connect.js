import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        const mongoDB = await mongoose.connect(`${process.env.MONGODB_URI}/shareMoments`);
        console.log("MONGODB CONNECTED SUCCESSFULLY");
        console.log(`\n${mongoDB.connection.host}`);
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED::", error);
    }
}