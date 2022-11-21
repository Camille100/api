import express from 'express';
import { addInvite, getInvites, getInvite, updateInvite, deleteInvite } from '../controllers/inviteController.js';

const router = express.Router();

router.post('/add', addInvite);
router.get('/invites', getInvites);
router.get('/:inviteId', getInvite);
router.put('/update/:inviteId', updateInvite);
router.delete('/delete/:inviteId', deleteInvite);

export default router;