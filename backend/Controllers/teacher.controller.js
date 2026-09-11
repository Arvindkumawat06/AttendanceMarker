import Teacher from '../Models/Teacher.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generate.token.js';
export const teachersRegister = async (req, res) => {
    const { name, email, password } = req.body;
    try {
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
        await teacher.save();
        res.status(201).json(teacher);
    } catch (error) {
        console.error("Error in Teacher Register",error.message);
        res.status(400).json({ message: 'Internal Server Error' });
    }
};

export const teachersLogin = async (req, res) => {
    const { email, password } = req.body;
    try{
        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(400).json({ message: 'Teacher not found' });
        }
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.status(200).json(teacher);

    } catch (error) {
        res.status(400).json({ message: 'Internal Server Error' });
        console.error("Error in Teacher Login",error.message);
    }
};