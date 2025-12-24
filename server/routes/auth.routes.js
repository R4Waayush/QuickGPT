import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import { authMiddleware, validateRequest } from '../middlewares/auth.middleware.js';

const authRouter = express.Router();

// Signup route
authRouter.post('/signup', validateRequest(['name', 'email', 'password']), signup);

// Login route
authRouter.post('/login', validateRequest(['email', 'password']), login);

//Auth route 
authRouter.get('/data', authMiddleware,(req,res)=>{
    res.json({
        success: true,
        message: 'Authentication working! You are authenticated.',
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            credits: req.user.credits
        }
    });
});

export default authRouter;

