import express from 'express';
import {teachersLogin} from '../Controllers/teacher.controller.js';
import {teachersRegister} from '../Controllers/teacher.controller.js';
import {createClass} from '../Controllers/teacher.controller.js';
import {addStudentToClass} from '../Controllers/teacher.controller.js';
import { ProtectRoute} from '../middleware/teacher.middleware.js';

const router = express.Router();


router.post('/login', teachersLogin);
router.post('/register', teachersRegister);
router.post('/create-class', ProtectRoute, createClass);
router.post('/add-student', ProtectRoute, addStudentToClass);

export default router;