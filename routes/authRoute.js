import express from 'express';
// import { autenticateToken } from '../middlewares/auth.js';
import { register, login, refreshToken, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/token', refreshToken);
router.get('/logout', logout);

export default router;