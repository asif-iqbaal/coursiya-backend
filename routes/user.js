import express from 'express'
import jwt from 'jsonwebtoken'
import JWT_SECRET from '../config.js'
import userMiddleware from '../middleware/user.js'
import { User } from '../models/user.model.js'
import { Course } from '../models/course.model.js'
import mongoose from 'mongoose';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await User.create({
            username,
            password
        })
        const token = jwt.sign({ username }, JWT_SECRET);
        res.json({
            msg: "user created successfully",
            token
        })
    } catch (error) {
        res.status(500).json({
            msg: "Admin creation failed",
            error: error.message
        });
    }

})

// router.post("/signin", async(req,res)=>{
//     const username = req.body.username;
//     const password = req.body.password;
//     console.log(JWT_SECRET);
//     try {
//         const user = await User.find({
//             username,
//             password
//         })
//         if(user){
//             const token = jwt.sign({
//                 username
//             },JWT_SECRET)
//             res.json({
//                token
//             })
//         }
//     } catch (error) {
//         res.status(403).json({
//             msg: "error in signin",
//             error: error.message
//         })
//     }

// })

router.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await User.findOne({ username, password });

        if (user) {
            // Assuming passwords are hashed using bcrypt
            // const isPasswordValid = await bcrypt.compare(password, user.password);
            const token = jwt.sign({ username }, JWT_SECRET);
            res.json({ token });

        } else {
            res.status(404).json({ msg: "User not found" });
        }
    } catch (error) {
        res.status(403).json({
            msg: "Error in signin",
            error: error.message
        });
    }
});



router.get('/courses', async (req, res) => {
    const response = await Course.find({});
    res.json({
        Course: response
    })
})

router.post('/courses/:courseId', userMiddleware, (req, res) => {

    const courseId = req.params.courseId;
    const username = req.body.username;

    User.updateOne({
        username: username
    }, {
        "$push": {
            purchasedCourses: new mongoose.Types.ObjectId(courseId)
        }
    }).catch(function (e) {
        console.log(e);
    })
    res.json({
        msg: "purchashed complete"
    })
})

// router.get('/purchashedCourses', async(req,res)=>{

//     const username = req.body.username;
//     console.log("purchased",{username});
//     const user =  await User.findOne({
//         username: username
//         })
//         console.log("hi there",user);
//         const courses = await Course.find({
//             _id:{
//                 "$in": user.purchasedCourses
//             }
//         });

//         res.json({
//             courses: courses
//         })

// })

router.get('/purchashedCourses', async (req, res) => {
    const username = req.query.username;  // Accessing the query parameter from the URL

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const courses = await Course.find({
            _id: {
                "$in": user.purchasedCourses
            }
        });

        res.json({ courses });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;