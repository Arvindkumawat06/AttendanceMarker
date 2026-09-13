import express from 'express';
import {teachersLogin} from '../Controllers/teacher.controller.js';
import {teachersRegister} from '../Controllers/teacher.controller.js';
import {getAllClasses, createClass, deleteClass} from '../Controllers/class.controller.js';
import {addStudent, getAllStudents, deleteStudent} from '../Controllers/student.controller.js';
import { ProtectRoute} from '../middleware/teacher.middleware.js';

const router = express.Router();


router.get('/protected', ProtectRoute, (req, res) => {
    res.status(200).json({ message: 'You have accessed a protected route', teacher: req.teacher });
});

//Authentication routes
router.post('/login', teachersLogin);
router.post('/register', teachersRegister);

//class routes
router.get('/getAllClasses', ProtectRoute, getAllClasses);
router.post('/createClass', ProtectRoute, createClass);
router.delete('/deleteClass/:id', ProtectRoute, deleteClass);

//student routes
router.get('/getAllStudents/:classId', ProtectRoute, getAllStudents);
router.post('/addStudent/:classId', ProtectRoute, addStudent);
router.delete('/deleteStudent/:studentId', ProtectRoute, deleteStudent);

export default router;