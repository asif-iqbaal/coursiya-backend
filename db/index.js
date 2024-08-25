import mongoose from "mongoose";


const connectDB = async()=>{

    await mongoose.connect(process.env.DATABASE_URL)
    .then(()=>console.log("mongoDB connected"))
    .catch((err)=>console.log("connection failed",err));
}

export default connectDB;