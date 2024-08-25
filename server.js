import "dotenv/config";
import express from 'express'
import connectDB from './db/index.js'
import adminRouter from './routes/admin.js'
import userRouter from './routes/user.js'
import cors from 'cors';
const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/admin', adminRouter);
app.use('/user', userRouter);

connectDB()
.then(app.listen(port, () => {
    console.log(`server is running at the ${port} port `);
}));