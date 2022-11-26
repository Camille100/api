import express from 'express';
import { addEvent, getEvents, getEventsByUser, getEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';

const router = express.Router();

router.post('/add', addEvent);
router.get('/events', getEvents);
router.get('/events/:userId', getEventsByUser);
router.get('/:eventId', getEvent);
router.put('/update/:eventId', updateEvent);
router.delete('/delete/:eventId', deleteEvent);

export default router;