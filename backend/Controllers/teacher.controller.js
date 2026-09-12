import Teacher from '../Models/Teacher.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generate.token.js';

// Teacher Signup
export const teachersRegister = async (req, res) => {
    
    const { name, email, password } = req.body;
    
    try {

        if(!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: 'Teacher already exists, please Login' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const teacher = new Teacher({
            name,
            email,
            password: hashedPassword
        });

        generateToken(teacher._id, res);
        await teacher.save();

        res.status(201).json({ message: 'Teacher registered successfully', teacher });
    }
     catch (error) {
        console.error("Error in Teacher Register",error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Teacher Login
export const teachersLogin = async (req, res) => {
    
    const { email, password } = req.body;
   
    try{
        if (!password || !email) {
            return res.status(400).json({ message: 'Provide all required fields' });
        }
        
        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(400).json({ message: 'Teacher not found, please register' });
        }
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        generateToken(teacher._id, res);
        res.status(200).json({ message: 'Teacher logged in successfully', teacher });

    } catch (error) {
        console.error("Error in Teacher Login",error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


