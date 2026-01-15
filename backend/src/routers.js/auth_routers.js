import {register, login, logout, UpdatePassword} from '../controllers/auth_controller.js';
import {requireAuth} from '../middlewares/auth.js';
import express from 'express';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.post('/update', requireAuth, UpdatePassword);
export default router;