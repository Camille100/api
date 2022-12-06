import express from 'express';
import {
    addEvent,
    getEvents,
    getEventsByUser,
    getEvent,
    updateEvent,
    deleteEvent,
    subscribeEvent,
    confirmAttendance
} from '../controllers/eventController.js';
import { authenticateUser } from '../middlewares/auth.js';

const router = express.Router();

router.post('/add', authenticateUser, addEvent);
router.get('/events', getEvents);
router.get('/events/:userId', authenticateUser, getEventsByUser);
router.put('/subscribe/:eventId', authenticateUser, subscribeEvent);
router.put('/attendance/:eventId', authenticateUser, confirmAttendance);
router.get('/:eventId', authenticateUser, getEvent);
router.get('/:eventId', authenticateUser, getEvent);
router.put('/update/:eventId', authenticateUser, updateEvent);
router.delete('/delete/:eventId', authenticateUser, deleteEvent);

export default router;