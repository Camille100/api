import express from 'express';
import { addDump, getDumps, getDump, getDumpsByUser, addCleaningDemand, deleteDump, updateCleaningDemand } from '../controllers/dumpController.js';

const router = express.Router();

router.post('/add', addDump);
router.get('/dumps', getDumps);
router.get('/:dumpId', getDump);
router.get('/dumps/:userId', getDumpsByUser);
router.put('/add/cleaning', addCleaningDemand);
router.put('/update/cleaning/:cleaningDemandId', updateCleaningDemand);
router.delete('/delete/cleaning', deleteDump);

export default router;