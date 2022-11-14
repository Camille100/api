import express from 'express';
import { addEvent, getEvents } from '../controllers/eventController.js';

const router = express.Router();

router.post('/add', addEvent);
router.get('/events', getEvents);

export default router;