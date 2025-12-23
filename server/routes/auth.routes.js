import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import { authMiddleware, validateRequest } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Signup route
router.post('/signup', validateRequest(['name', 'email', 'password']), signup);

// Login route
router.post('/login', validateRequest(['email', 'password']), login);

//Auth route 
router.get('/data', authMiddleware,(req,res)=>{
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

export default router;

