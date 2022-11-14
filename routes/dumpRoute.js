import express from 'express';
import { addDump, getDumps, getDump, getDumpsByUser } from '../controllers/dumpController.js';

const router = express.Router();

router.post('/add', addDump);
router.get('/dumps', getDumps);
router.get('/:dumpId', getDump);
router.get('/dumps/:userId', getDumpsByUser);

export default router;