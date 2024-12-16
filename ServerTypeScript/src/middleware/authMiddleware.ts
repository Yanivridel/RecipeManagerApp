import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import userModel from './../models/userModel';

import { AuthenticatedRequestOptional } from 'src/types/expressTypes';

export const authenticateToken = async (req: AuthenticatedRequestOptional, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ 
        status: "error",
        message: 'Access denied, no token provided' 
        });
        return;
    }

    try {
        const jwtSecretKey = process.env.JWT_SECRET_KEY as string;

        const decoded = jwt.verify(token, jwtSecretKey) as { email: string };
        const user = await userModel.findOne({ email: decoded.email });

        if(!user) {
            res.status(404).json({ status: "error", message: 'User not found' });
            return;
        }

        req.userId = user._id as string;
        next();
    } catch (error) {
        res.status(401).json({ status: "error", message: 'Invalid token' });
    }
};
