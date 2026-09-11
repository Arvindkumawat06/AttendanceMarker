import Teacher from '../Models/Teacher.js';
import Class from '../Models/Class.js';
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
        generateToken(teacher._id, res);
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
        gererateToken(teacher._id, res);
        res.status(200).json(teacher);

    } catch (error) {
        res.status(400).json({ message: 'Internal Server Error' });
        console.error("Error in Teacher Login",error.message);
    }
};

export const createClass = async (req, res) => {
    const { name, teacherId } = req.body;
    try{
        const newClass = await Class.create({
            name,
            teacher: teacherId
        });
        res.status(201).json(newClass);

    } catch(error){
        console.error("Error in Create Class",error.message);
        res.status(400).json({ message: 'Internal Server Error' });
    }
};

export const addStudentToClass = async (req, res) => {
    const { classId, studentId } = req.body;
    try {
        const classObj = await Class.findById(classId);
        if (!classObj) {
            return res.status(404).json({ message: 'Class not found' });
        }
        classObj.students.push(studentId);
        await classObj.save();
        res.status(200).json(classObj);
    } catch (error) {
        console.error("Error in Add Student to Class",error.message);
        res.status(400).json({ message: 'Internal Server Error' });
    }
};