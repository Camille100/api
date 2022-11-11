import express from 'express';
import { addDump, getDumps } from '../controllers/dumpController.js';

const router = express.Router();

router.post('/add', addDump);
router.get('/dumps', getDumps);

export default router;