import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({

    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    purchasedCourses :[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
})

export const User =mongoose.model("User",userSchema);