import mongoose, { Schema } from 'mongoose'

const adminSchema = new Schema({

    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    availableCourses : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ]
})

export const Admin =mongoose.model("Admin",adminSchema);