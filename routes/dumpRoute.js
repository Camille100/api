import express from 'express';
import { addDump, getDumps, getDump, getDumpsByUser, addCleaningDemand, deleteDump, updateCleaningDemand } from '../controllers/dumpController.js';
import { authenticateUser } from '../middlewares/auth.js';

const router = express.Router();

router.post('/add', authenticateUser, addDump);
router.get('/dumps', getDumps);
router.get('/:dumpId', authenticateUser, getDump);
router.get('/dumps/:userId', authenticateUser, getDumpsByUser);
router.put('/add/cleaning', authenticateUser, addCleaningDemand);
router.put('/update/cleaning/:cleaningDemandId', authenticateUser, updateCleaningDemand);
router.delete('/delete/cleaning', authenticateUser, deleteDump);

export default router;