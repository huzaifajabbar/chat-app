import mongoose from "mongoose";

export const connect_db = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database connected")
    }

    catch(err) {
       console.log(`Database connection error:`, err)
    }
}