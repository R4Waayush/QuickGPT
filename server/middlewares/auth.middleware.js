import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Authentication Middleware
export const authMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Authorization header must be in format: Bearer <token>'
            });
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.substring(7);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired'
                });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            } else {
                throw error;
            }
        }

        // Find user by ID from token
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Request Validation Middleware
export const validateRequest = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = [];
        const errors = {};

        // Check for missing required fields
        for (const field of requiredFields) {
            if (!req.body[field] || (typeof req.body[field] === 'string' && req.body[field].trim() === '')) {
                missingFields.push(field);
                errors[field] = `${field} is required`;
            }
        }

        // If there are missing fields, return error
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        // Additional validations
        if (requiredFields.includes('email')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(req.body.email)) {
                errors.email = 'Please provide a valid email address';
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors
                });
            }
        }

        if (requiredFields.includes('password')) {
            if (req.body.password.length < 6) {
                errors.password = 'Password must be at least 6 characters long';
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors
                });
            }
        }

        next();
    };
};

