import express from 'express';
import { getUsers, getUser, searchUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/users', getUsers);
router.post('/user', getUser);
router.post('/search', searchUser);

export default router;