import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./configs/db.js";
import authRoutes from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';
import { authMiddleware } from './middlewares/auth.middleware.js';

const app = express();

await connectDB();

//middleware

app.use(cors());
app.use(express.json());

//routes

app.get('/',(req,res)=>{
    res.send("server is live");
})

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRouter);



const PORT = process.env.PORT || 3000;

app.listen(PORT,(req,res)=>{
    console.log(`server is running on port ${PORT}`);
})
