import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
    tittle:String,
    description:String,
    imageLink: String,
    price:Number

})

export const Course = mongoose.model("Course",courseSchema);