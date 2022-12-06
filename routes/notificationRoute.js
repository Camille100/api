import express from 'express';
import { addNotification, getNotification, getNotifications, getNotificationsByUser, updateNotification, deleteNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/add', addNotification);
router.get('/notifications', getNotifications);
router.get('/notifications/:userId', getNotificationsByUser);
router.get('/:notificationId', getNotification);
router.put('/update/:notificationId', updateNotification);
router.delete('/delete/:notificationId', deleteNotification);

export default router;