import jwt from 'jsonwebtoken';
import Teacher from '../Models/Teacher.js';

export const ProtectRoute = async(req,res,next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({ message: 'Unauthorized, no token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const teacher = await Teacher.findById(decoded.id).select('-password');
        if(!teacher){
            return res.status(401).json({ message: 'Unauthorized, invalid token' });
        }
        req.teacher = teacher;
        next();
    } catch (error) {
        console.error("Error in Protect Route",error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};