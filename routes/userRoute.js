import express from 'express';
import { getUsers, getUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/users', getUsers);
router.post('/user', getUser);

export default router;