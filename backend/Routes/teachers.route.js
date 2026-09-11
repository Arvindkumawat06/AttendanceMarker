import express from 'express';
import {teachersLogin} from '../Controllers/teacher.controller.js';
import {teachersRegister} from '../Controllers/teacher.controller.js';

const router = express.Router();


router.post('/login', teachersLogin);
router.post('/register', teachersRegister);

export default router;