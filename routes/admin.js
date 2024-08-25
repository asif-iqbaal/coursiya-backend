import express from 'express'
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken'
import JWT_SECRET from '../config.js';
import adminMiddleware from '../middleware/admin.js'
import { Admin } from '../models/admin.model.js';
import { Course } from '../models/course.model.js';
import cloudinary from 'cloudinary';

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Set up Multer storage and file naming
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Directory to save the uploaded files
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
//     }
// });

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await Admin.create({
            username: username,
            password: password

        })
        const token = jwt.sign({ username }, JWT_SECRET);
        res.json({ 
            msg: "Admin created successfully",
            token });
       
    }
    catch (error) {
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
//         const user = await Admin.find({
//             username : username,
//             password : password
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
        const user = await Admin.findOne({ username, password });

        if (user) {
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


router.post('/courses', adminMiddleware, upload.single('image'), async (req, res) => {
    const username = req.query.username || req.body.username;

    const tittle = req.body.tittle;
    const description = req.body.description;
    const price = req.body.price;

    try {
        let imageLink = null;
        if (req.file) {
            // Upload to Cloudinary
            const result = await new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }).end(req.file.buffer);
            });

            imageLink = result.secure_url;
        }

        const newCourse = await Course.create({
            tittle,
            description,
            imageLink,
            price
        });


        Admin.updateOne({
            username: username
        }, {
            "$push": {
                availableCourses: newCourse._id
            }
        }).catch(function (e) {
            console.log(e);
        })

        res.json({
            msg: "Course created successfully",
            courseId: newCourse._id,
            course: newCourse

        });
    } catch (error) {
        res.status(500).json({ msg: "Course creation failed", error: error.message });
    }

})

router.get('/courses', async (req, res) => {
    const username = req.query.username;


    try {
        const user = await Admin.findOne({
            username
        })
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        const courses = await Course.find({
            _id: {
                "$in": user.availableCourses
            }
        });

        res.json({ courses });
    } catch (error) {
        res.status(500).json({ msg: "no courses available" })
    }
})
export default router;